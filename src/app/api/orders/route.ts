import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { sendPushToRole, sendPushToUser } from "@/lib/push";
import { auth } from "@/auth";
import { checkoutSchema } from "@/schemas/order";

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
    const order = await prisma.$transaction(async (tx) => {
      let total = 0;

      const orderItemsData: {
        productId: number;
        productName: string;
        price: number;
        quantity: number;
        ownerId: string | null;
        commissionRate: number | null;
        commissionAmount: number | null;
      }[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { owner: { select: { commissionRate: true } } },
        });

        if (!product) {
          throw new Error(`Produit ${item.productId} introuvable`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Stock insuffisant pour "${product.name}" (disponible: ${product.stock})`,
          );
        }

        // update stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });

        total += product.price * item.quantity + 7;

        // Commission only applies to products owned by a B2B partner — house
        // products (ownerId null) never carry a commission.
        const commissionRate = product.ownerId ? (product.owner?.commissionRate ?? 10) : null;
        const commissionAmount =
          commissionRate !== null
            ? Math.round(product.price * item.quantity * (commissionRate / 100) * 100) / 100
            : null;

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
          ownerId: product.ownerId,
          commissionRate,
          commissionAmount,
        });
      }

      const newOrder = await tx.order.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          address,
          city,
          total,
          paymentMethod: paymentMethod || "cod",
          notes,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

      return newOrder;
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

    const where: Prisma.OrderWhereInput = {};

    if (email) where.customerEmail = email;
    if (status && status !== "all") where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error(err);

    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
