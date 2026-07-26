import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { sanitizeHtml } from "@/lib/sanitize";
import { deleteGuide, updateGuide } from "@/repositories/guideRepository";

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
  const data: Prisma.PracticalGuideUpdateInput = {};
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.summary === "string") data.summary = body.summary.trim();
  if (typeof body.content === "string") data.content = sanitizeHtml(body.content.trim());
  if (body.category !== undefined) data.category = body.category || null;
  if (body.icon !== undefined) data.icon = body.icon || null;
  if (body.image !== undefined) data.image = body.image || null;
  if (typeof body.active === "boolean") data.active = body.active;
  if (typeof body.order === "number") data.order = body.order;

  const guide = await updateGuide(guideId, data);
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

  await deleteGuide(guideId);
  return new NextResponse(null, { status: 204 });
}
