import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET /api/availability?serviceId=&date=YYYY-MM-DD
// Retourne les créneaux horaires du service pour cette date, avec places restantes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const dateParam = searchParams.get("date"); // YYYY-MM-DD

    if (!serviceId || !dateParam) {
      return NextResponse.json({ error: "serviceId et date requis" }, { status: 400 });
    }

    const dayStart = new Date(`${dateParam}T00:00:00.000Z`);
    if (isNaN(dayStart.getTime())) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }

    const slots = await prisma.timeSlot.findMany({
      where: { serviceId: parseInt(serviceId), date: dayStart },
      include: { _count: { select: { bookings: true } } },
      orderBy: { time: "asc" },
    });

    const result = slots.map((slot) => ({
      id: slot.id,
      time: slot.time,
      capacity: slot.capacity,
      booked: slot._count.bookings,
      remaining: Math.max(0, slot.capacity - slot._count.bookings),
      full: slot._count.bookings >= slot.capacity,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

// POST /api/availability  (admin: créer des créneaux pour un service/date)
// body: { serviceId, date: "YYYY-MM-DD", times: ["09:00","11:00",...], capacity }
export async function POST(req: NextRequest) {
  try {
    const { serviceId, date, times, capacity } = await req.json();

    if (!serviceId || !date || !Array.isArray(times) || times.length === 0) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const dayStart = new Date(`${date}T00:00:00.000Z`);

    const created = await prisma.$transaction(
      times.map((time: string) =>
        prisma.timeSlot.upsert({
          where: { serviceId_date_time: { serviceId: parseInt(serviceId), date: dayStart, time } },
          update: { capacity: capacity ?? 5 },
          create: {
            serviceId: parseInt(serviceId),
            date: dayStart,
            time,
            capacity: capacity ?? 5,
          },
        })
      )
    );

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create slots" }, { status: 500 });
  }
}