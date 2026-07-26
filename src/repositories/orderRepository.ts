import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface OrderListFilters {
  email?: string | null;
  status?: string | null;
}

export async function getOrders({ email, status }: OrderListFilters) {
  const where: Prisma.OrderWhereInput = {};

  if (email) where.customerEmail = email;
  if (status && status !== "all") where.status = status;

  return prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

interface CreateOrderItemInput {
  productId: number;
  quantity: number;
}

interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address: string;
  city?: string;
  paymentMethod?: string;
  notes?: string;
  items: CreateOrderItemInput[];
}

export async function createOrder(input: CreateOrderInput) {
  return prisma.$transaction(async (tx) => {
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

    for (const item of input.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: { owner: { select: { commissionRate: true } } },
      });

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

    return tx.order.create({
      data: {
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        address: input.address,
        city: input.city,
        total,
        paymentMethod: input.paymentMethod || "cod",
        notes: input.notes,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });
  });
}
