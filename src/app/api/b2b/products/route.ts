import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { createNotification } from "@/lib/notifications";

function requireArtisan(session: Session | null) {
  return session?.user?.role === "B2B" && session.user.b2bType === "ARTISAN";
}

// GET /api/b2b/products — the artisan's own products, any submission status
export async function GET() {
  const session = await auth();
  if (!requireArtisan(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { ownerId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

// POST /api/b2b/products — create a new product, always starts pending review
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!requireArtisan(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
        ownerId: session!.user.id,
        submissionStatus: "pending",
      },
    });

    await createNotification({
      recipient: "admin",
      type: "b2b_submission",
      title: "Nouveau produit à valider",
      body: `${session!.user.name ?? "Un artisan"} a soumis le produit « ${name} ».`,
      link: "/admin/b2b-submissions",
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
