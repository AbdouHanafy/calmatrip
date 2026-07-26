import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import type { Session } from "next-auth";
import { createNotification } from "@/lib/notifications";
import { sanitizeHtml } from "@/lib/sanitize";

function requireAgency(session: Session | null) {
  return session?.user?.role === "B2B" && session.user.b2bType === "AGENCY";
}

async function loadOwnedService(id: number, ownerId: string) {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service || service.ownerId !== ownerId) return null;
  return service;
}

// PATCH /api/b2b/services/[id] — edit own service; re-queues for review
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!requireAgency(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
  }

  const existing = await loadOwnedService(id, session!.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const json = await req.json();
    const data: Record<string, unknown> = { submissionStatus: "pending", rejectionReason: null };

    if (json.title !== undefined) data.title = json.title;
    if (json.subtitle !== undefined) data.subtitle = json.subtitle;
    if (json.description !== undefined) data.description = sanitizeHtml(json.description);
    if (json.price !== undefined) data.price = json.price.toString();
    if (json.category !== undefined) data.category = json.category;
    if (json.duration !== undefined) data.duration = json.duration;
    if (json.icon !== undefined) data.icon = json.icon;
    if (json.color !== undefined) data.color = json.color;
    if (json.image !== undefined) data.image = json.image;

    const service = await prisma.service.update({ where: { id }, data });

    await createNotification({
      recipient: "admin",
      type: "b2b_submission",
      title: "Service modifié à revalider",
      body: `${session!.user.name ?? "Une agence"} a modifié le service « ${service.title} ».`,
      link: "/admin/b2b-submissions",
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Failed to update service:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// DELETE /api/b2b/services/[id] — remove own service
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!requireAgency(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
  }

  const existing = await loadOwnedService(id, session!.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.service.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
