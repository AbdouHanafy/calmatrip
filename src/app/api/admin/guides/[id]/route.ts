import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sanitizeHtml } from "@/lib/sanitize";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const guideId = parseInt(id);
  if (isNaN(guideId)) {
    return NextResponse.json({ error: "Guide invalide" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.summary === "string") data.summary = body.summary.trim();
  if (typeof body.content === "string") data.content = sanitizeHtml(body.content.trim());
  if (body.category !== undefined) data.category = body.category || null;
  if (body.icon !== undefined) data.icon = body.icon || null;
  if (body.image !== undefined) data.image = body.image || null;
  if (typeof body.active === "boolean") data.active = body.active;
  if (typeof body.order === "number") data.order = body.order;

  const guide = await prisma.practicalGuide.update({ where: { id: guideId }, data });
  return NextResponse.json(guide);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const guideId = parseInt(id);
  if (isNaN(guideId)) {
    return NextResponse.json({ error: "Guide invalide" }, { status: 400 });
  }

  await prisma.practicalGuide.delete({ where: { id: guideId } });
  return new NextResponse(null, { status: 204 });
}
