import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET /api/products/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const related = await prisma.product.findMany({
      where: { category: product.category, id: { not: product.id } },
      take: 4,
    });

    return NextResponse.json({ product, related });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id]  (admin: update, including stock)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, price, category, image, description, stock, sizes } = body;

    let sizesUpdate: { sizes?: string[] | typeof Prisma.JsonNull } = {};
    if (sizes !== undefined) {
      if (sizes !== null && (!Array.isArray(sizes) || !sizes.every((s) => typeof s === "string"))) {
        return NextResponse.json({ error: "Invalid sizes format" }, { status: 400 });
      }
      const isEmpty = sizes === null || (Array.isArray(sizes) && sizes.length === 0);
      sizesUpdate.sizes = isEmpty ? Prisma.JsonNull : sizes;
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(category !== undefined && { category }),
        ...(image !== undefined && { image }),
        ...(description !== undefined && { description }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...sizesUpdate,
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}