import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { productCreateSchema } from "@/schemas/product";
import { getPublicProducts } from "@/repositories/productRepository";

// GET /api/products?search=&category=&sort=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";

    const result = await getPublicProducts({ search, category, sort });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products  (admin: create product)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.json();
    const parsed = productCreateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { name, price, category, image, description, stock, sizes } = parsed.data;

    const normalizedSizes: string[] | typeof Prisma.JsonNull =
      sizes && sizes.length > 0 ? sizes : Prisma.JsonNull;

    const product = await prisma.product.create({
      data: {
        name,
        price,
        category,
        image: image || "/placeholder-product.png",
        description,
        stock: stock ?? 100,
        sizes: normalizedSizes,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
