import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { sanitizeHtml } from "@/lib/sanitize";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt((await params).id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }

    const json = await req.json();
    const data: Record<string, unknown> = {};

    if (json.title !== undefined) data.title = json.title;
    if (json.subtitle !== undefined) data.subtitle = json.subtitle;
    if (json.description !== undefined) data.description = sanitizeHtml(json.description);
    if (json.price !== undefined) data.price = json.price.toString();
    if (json.category !== undefined) data.category = json.category;
    if (json.duration !== undefined) data.duration = json.duration;
    if (json.icon !== undefined) data.icon = json.icon;
    if (json.color !== undefined) data.color = json.color;
    if (json.image !== undefined) data.image = json.image;
    if (json.features !== undefined) data.features = json.features;
    if (json.active !== undefined) data.active = json.active;
    if (json.popular !== undefined) data.popular = json.popular;
    if (json.order !== undefined) data.order = json.order;

    const service = await prisma.service.update({
      where: { id },
      data,
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error("Failed to update service:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt((await params).id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }

    await prisma.service.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
