import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { createNotification } from "@/lib/notifications";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: { submissionStatus: "rejected", rejectionReason: reason || null },
  });

  if (product.ownerId) {
    await createNotification({
      recipient: "user",
      userId: product.ownerId,
      type: "b2b_decision",
      title: "Produit refusé",
      body: reason
        ? `Votre produit « ${product.name} » n'a pas été approuvé : ${reason}`
        : `Votre produit « ${product.name} » n'a pas été approuvé.`,
      link: "/b2b/products",
    });
  }

  return NextResponse.json(product);
}
