import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { isApprovedPartner } from "@/lib/access";
import { createNotification } from "@/lib/notifications";
import { productCreateSchema } from "@/schemas/product";
import { createProduct, getOwnedProducts } from "@/repositories/productRepository";

function requireArtisan(session: Session | null) {
  return isApprovedPartner(session, "ARTISAN");
}

// GET /api/b2b/products — the artisan's own products, any submission status
export async function GET() {
  const session = await auth();
  if (!requireArtisan(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await getOwnedProducts(session!.user.id);

  return NextResponse.json({ products });
}

// POST /api/b2b/products — create a new product, always starts pending review
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!requireArtisan(session)) {
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

    const product = await createProduct({
      name,
      price,
      category,
      image,
      description,
      stock,
      sizes: normalizedSizes,
      ownerId: session!.user.id,
      submissionStatus: "pending",
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
