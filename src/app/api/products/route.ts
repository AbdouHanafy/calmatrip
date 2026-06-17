import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET /api/products?search=&category=&sort=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (category && category !== "all") {
      where.category = category;
    }

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
        ? { price: "desc" as const }
        : sort === "name"
        ? { name: "asc" as const }
        : { createdAt: "desc" as const };

    const products = await prisma.product.findMany({ where, orderBy });
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
    });

    return NextResponse.json({
      products,
      categories: categories.map((c) => c.category),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products  (admin: create product)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, category, image, description, stock, sizes } = body;

    if (!name || price === undefined || !category || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let normalizedSizes: string[] | typeof Prisma.JsonNull = Prisma.JsonNull;
    if (sizes !== undefined && sizes !== null) {
      if (!Array.isArray(sizes) || !sizes.every((s) => typeof s === "string")) {
        return NextResponse.json({ error: "Invalid sizes format" }, { status: 400 });
      }
      normalizedSizes = sizes.length > 0 ? sizes : Prisma.JsonNull;
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        image: image || "/placeholder-product.png",
        description,
        stock: stock !== undefined ? parseInt(stock) : 100,
        sizes: normalizedSizes,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}