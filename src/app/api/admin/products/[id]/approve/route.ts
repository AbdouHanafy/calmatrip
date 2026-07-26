import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createNotification } from "@/lib/notifications";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { approveProduct } from "@/repositories/productRepository";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await approveProduct(parseInt(id));

  if (product.ownerId) {
    await prisma.user.updateMany({
      where: { id: product.ownerId, b2bStatus: "pending" },
      data: { b2bStatus: "approved" },
    });
    await createNotification({
      recipient: "user",
      userId: product.ownerId,
      type: "b2b_decision",
      title: "Produit approuvé",
      body: `Votre produit « ${product.name} » est maintenant visible sur la Marketplace.`,
      link: "/b2b/products",
    });

    const owner = await prisma.user.findUnique({
      where: { id: product.ownerId },
      select: { phone: true },
    });
    if (owner?.phone) {
      await sendWhatsAppMessage(
        owner.phone,
        `Bonne nouvelle ! Votre produit « ${product.name} » vient d'être approuvé et est maintenant visible sur la Marketplace Calma Trip.`,
      );
    }
  }

  return NextResponse.json(product);
}
