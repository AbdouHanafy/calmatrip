import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { createNotification } from "@/lib/notifications";
import { productUpdateSchema } from "@/schemas/product";

function requireArtisan(session: Session | null) {
  return session?.user?.role === "B2B" && session.user.b2bType === "ARTISAN";
}

async function loadOwnedProduct(id: string, ownerId: string) {
  const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
  if (!product || product.ownerId !== ownerId) return null;
  return product;
}

// PATCH /api/b2b/products/[id] — edit own product; re-queues for review
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!requireArtisan(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await loadOwnedProduct(id, session!.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const rawBody = await req.json();
    const parsed = productUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { name, price, category, image, description, stock, sizes } = parsed.data;

    const sizesUpdate: { sizes?: string[] | typeof Prisma.JsonNull } =
      sizes !== undefined ? { sizes: sizes && sizes.length > 0 ? sizes : Prisma.JsonNull } : {};

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(category !== undefined && { category }),
        ...(image !== undefined && { image }),
        ...(description !== undefined && { description }),
        ...(stock !== undefined && { stock }),
        ...sizesUpdate,
        submissionStatus: "pending",
        rejectionReason: null,
      },
    });

    await createNotification({
      recipient: "admin",
      type: "b2b_submission",
      title: "Produit modifié à revalider",
      body: `${session!.user.name ?? "Un artisan"} a modifié le produit « ${product.name} ».`,
      link: "/admin/b2b-submissions",
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/b2b/products/[id] — remove own product
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!requireArtisan(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await loadOwnedProduct(id, session!.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
