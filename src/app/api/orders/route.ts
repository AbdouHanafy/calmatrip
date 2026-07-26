import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { sendPushToRole, sendPushToUser } from "@/lib/push";
import { auth } from "@/auth";
import { checkoutSchema } from "@/schemas/order";
import { createOrder, getOrders } from "@/repositories/orderRepository";

// POST /api/orders (checkout)
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = checkoutSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      paymentMethod,
      notes,
      items,
    } = parsed.data;

    // 1. CREATE ORDER (transaction safe)
    const order = await createOrder({
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      paymentMethod,
      notes,
      items,
    });

    // 2. NOTIFICATIONS SYSTEM
    const notifications: Promise<unknown>[] = [];

    // 🔴 ADMIN notification (DB)
    notifications.push(
      createNotification({
        recipient: "admin",
        type: "new_order",
        title: "Nouvelle commande 🛒",
        body: `Commande #${order.id} - ${order.total.toFixed(2)} TND`,
        link: `/admin/orders/${order.id}`,
        metadata: {
          orderId: order.id,
          email: order.customerEmail,
        },
      }),
    );

    // 🔴 PUSH ADMIN
    notifications.push(
      sendPushToRole("ADMIN", {
        title: "new Command🛒",
        body: `${order.customerName} - ${order.total.toFixed(2)} TND`,
        link: `/admin/orders/${order.id}`,
      }),
    );

    // 🟢 USER notification (si user existe dans DB)
    const user = await prisma.user.findUnique({
      where: { email: order.customerEmail },
    });

    if (user) {
      notifications.push(
        createNotification({
          recipient: "user",
          userId: user.id,
          type: "order_created",
          title: "Commande created",
          body: `your command #${order.id} has been received!`,
          link: "/marketplace/orders",
          metadata: {
            orderId: order.id,
          },
        }),
      );

      notifications.push(
        sendPushToUser(user.id, {
          title: " Commande created",
          body: `Commande #${order.id} recieved!`,
          link: "/marketplace/orders",
        }),
      );
    }

    await Promise.all(notifications);

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Échec de la commande" },
      { status: 400 },
    );
  }
}

// GET /api/orders
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const isAdmin = session?.user?.role === "ADMIN";

    if (email) {
      if (
        !session?.user?.email ||
        (session.user.email.toLowerCase() !== email.toLowerCase() && !isAdmin)
      ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getOrders({ email, status });

    return NextResponse.json(orders);
  } catch (err) {
    console.error(err);

    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
