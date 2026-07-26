import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createEvent, getAllEvents } from "@/repositories/eventRepository";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await getAllEvents();
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const startDate = body.startDate ? new Date(body.startDate) : null;

  if (!title || !description || !city || !startDate || isNaN(startDate.getTime())) {
    return NextResponse.json(
      { error: "Titre, description, ville et date de début requis" },
      { status: 400 },
    );
  }

  const event = await createEvent({
    title,
    description,
    city,
    startDate,
    endDate: body.endDate ? new Date(body.endDate) : null,
    address: body.address || null,
    price: body.price || null,
    category: body.category || null,
    image: body.image || null,
    lat: typeof body.lat === "number" ? body.lat : null,
    lng: typeof body.lng === "number" ? body.lng : null,
    active: body.active ?? true,
  });

  return NextResponse.json(event, { status: 201 });
}
