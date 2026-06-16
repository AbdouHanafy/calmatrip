import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET /api/availability/dates?serviceId=&from=YYYY-MM-DD&to=YYYY-MM-DD
// Retourne, pour chaque date dans la plage, si elle a au moins 1 créneau avec place restante.
// Utilisé pour activer/désactiver les dates dans le calendrier du formulaire.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!serviceId || !from || !to) {
      return NextResponse.json({ error: "serviceId, from, to requis" }, { status: 400 });
    }

    const fromDate = new Date(`${from}T00:00:00.000Z`);
    const toDate = new Date(`${to}T23:59:59.999Z`);

    const slots = await prisma.timeSlot.findMany({
      where: {
        serviceId: parseInt(serviceId),
        date: { gte: fromDate, lte: toDate },
      },
      include: { _count: { select: { bookings: true } } },
    });

    const byDate = new Map<string, { total: number; booked: number }>();
    for (const slot of slots) {
      const key = slot.date.toISOString().slice(0, 10);
      const entry = byDate.get(key) || { total: 0, booked: 0 };
      entry.total += slot.capacity;
      entry.booked += slot._count.bookings;
      byDate.set(key, entry);
    }

    const dates = Array.from(byDate.entries()).map(([date, { total, booked }]) => ({
      date,
      available: booked < total,
      remaining: Math.max(0, total - booked),
    }));

    return NextResponse.json(dates);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch available dates" }, { status: 500 });
  }
}