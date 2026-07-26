import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { deleteMuseum, updateMuseum } from "@/repositories/museumRepository";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const museumId = parseInt(id);
  if (isNaN(museumId)) {
    return NextResponse.json({ error: "Musée invalide" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const data: Prisma.MuseumUpdateInput = {};
  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.description === "string") data.description = body.description.trim();
  if (typeof body.city === "string") data.city = body.city.trim();
  if (body.address !== undefined) data.address = body.address || null;
  if (body.openingHours !== undefined) data.openingHours = body.openingHours || null;
  if (body.price !== undefined) data.price = body.price || null;
  if (body.image !== undefined) data.image = body.image || null;
  if (typeof body.lat === "number") data.lat = body.lat;
  if (typeof body.lng === "number") data.lng = body.lng;
  if (typeof body.active === "boolean") data.active = body.active;
  if (typeof body.order === "number") data.order = body.order;

  const museum = await updateMuseum(museumId, data);
  return NextResponse.json(museum);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const museumId = parseInt(id);
  if (isNaN(museumId)) {
    return NextResponse.json({ error: "Musée invalide" }, { status: 400 });
  }

  await deleteMuseum(museumId);
  return new NextResponse(null, { status: 204 });
}
