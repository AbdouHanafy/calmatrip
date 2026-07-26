import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { productUpdateSchema } from "@/schemas/product";
import { getProductById, updateProduct, deleteProduct } from "@/repositories/productRepository";

// GET /api/products/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await getProductById(parseInt(id));
    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id]  (admin: update, including stock)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const rawBody = await req.json();
    const parsed = productUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { name, price, category, image, description, stock, sizes } = parsed.data;

    const sizesUpdate: { sizes?: string[] | typeof Prisma.JsonNull } =
      sizes !== undefined ? { sizes: sizes && sizes.length > 0 ? sizes : Prisma.JsonNull } : {};

    const product = await updateProduct(parseInt(id), {
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(category !== undefined && { category }),
      ...(image !== undefined && { image }),
      ...(description !== undefined && { description }),
      ...(stock !== undefined && { stock }),
      ...sizesUpdate,
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteProduct(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
