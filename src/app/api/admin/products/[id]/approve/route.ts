import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createNotification } from "@/lib/notifications";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: { submissionStatus: "approved", rejectionReason: null },
  });

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
  }

  return NextResponse.json(product);
}
