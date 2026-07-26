import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const eventId = parseInt(id);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: "Événement invalide" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.description === "string") data.description = body.description.trim();
  if (typeof body.city === "string") data.city = body.city.trim();
  if (body.startDate) data.startDate = new Date(body.startDate);
  if (body.endDate !== undefined) data.endDate = body.endDate ? new Date(body.endDate) : null;
  if (body.address !== undefined) data.address = body.address || null;
  if (body.price !== undefined) data.price = body.price || null;
  if (body.category !== undefined) data.category = body.category || null;
  if (body.image !== undefined) data.image = body.image || null;
  if (typeof body.lat === "number") data.lat = body.lat;
  if (typeof body.lng === "number") data.lng = body.lng;
  if (typeof body.active === "boolean") data.active = body.active;
  if (typeof body.order === "number") data.order = body.order;

  const event = await prisma.event.update({ where: { id: eventId }, data });
  return NextResponse.json(event);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const eventId = parseInt(id);
  if (isNaN(eventId)) {
    return NextResponse.json({ error: "Événement invalide" }, { status: 400 });
  }

  await prisma.event.delete({ where: { id: eventId } });
  return new NextResponse(null, { status: 204 });
}
