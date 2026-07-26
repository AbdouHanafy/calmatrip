import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const museums = await prisma.museum.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  return NextResponse.json(museums);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";

  if (!name || !description || !city) {
    return NextResponse.json({ error: "Nom, description et ville requis" }, { status: 400 });
  }

  const museum = await prisma.museum.create({
    data: {
      name,
      description,
      city,
      address: body.address || null,
      openingHours: body.openingHours || null,
      price: body.price || null,
      image: body.image || null,
      lat: typeof body.lat === "number" ? body.lat : null,
      lng: typeof body.lng === "number" ? body.lng : null,
      active: body.active ?? true,
    },
  });

  return NextResponse.json(museum, { status: 201 });
}
