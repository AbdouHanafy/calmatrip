import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const VALID_TYPES = new Set(["product", "place", "event", "museum", "service"]);

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const itemType = req.nextUrl.searchParams.get("type");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id, ...(itemType ? { itemType } : {}) },
    select: { itemType: true, itemId: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const itemType = typeof body.itemType === "string" ? body.itemType : "";
  const itemId = Number(body.itemId);

  if (!VALID_TYPES.has(itemType) || !Number.isInteger(itemId)) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const favorite = await prisma.favorite.upsert({
    where: { userId_itemType_itemId: { userId: session.user.id, itemType, itemId } },
    create: { userId: session.user.id, itemType, itemId },
    update: {},
  });

  return NextResponse.json(favorite, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const itemType = typeof body.itemType === "string" ? body.itemType : "";
  const itemId = Number(body.itemId);

  if (!VALID_TYPES.has(itemType) || !Number.isInteger(itemId)) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, itemType, itemId },
  });

  return new NextResponse(null, { status: 204 });
}
