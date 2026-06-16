import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CheckoutItem {
  productId: number;
  quantity: number;
}

// POST /api/orders  (checkout)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      paymentMethod,
      notes,
      items,
    }: {
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      address: string;
      city?: string;
      paymentMethod?: string;
      notes?: string;
      items: CheckoutItem[];
    } = body;

    if (!customerName || !customerEmail || !address || !items?.length) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData: {
        productId: number;
        productName: string;
        price: number;
        quantity: number;
      }[] = [];

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) {
          throw new Error(`Produit ${item.productId} introuvable`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour "${product.name}" (disponible: ${product.stock})`);
        }

        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });

        total += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
        });
      }

      return tx.order.create({
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
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Échec de la commande" },
      { status: 400 }
    );
  }
}

// GET /api/orders?email=  (historique commandes d'un client, ou tout pour admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const status = searchParams.get("status");

    const where: any = {};
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