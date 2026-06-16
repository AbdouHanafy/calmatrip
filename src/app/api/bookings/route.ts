import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

interface BookingPayload {
  serviceId: number;
  date: string; // YYYY-MM-DD
  time: string; // "09:00"
  fromLocation: string;
  toLocation: string;
  passengers?: number;
  hasLuggage?: boolean;
  specialRequests?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

// POST /api/bookings  (user: créer une réservation)
export async function POST(req: NextRequest) {
  try {
    const body: BookingPayload = await req.json();
    const {
      serviceId,
      date,
      time,
      fromLocation,
      toLocation,
      passengers,
      hasLuggage,
      specialRequests,
      customerName,
      customerEmail,
      customerPhone,
    } = body;

    if (!serviceId || !date || !time || !fromLocation || !toLocation || !customerName || !customerEmail) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const dayStart = new Date(`${date}T00:00:00.000Z`);
    if (isNaN(dayStart.getTime())) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    if (dayStart < new Date(new Date().toISOString().slice(0, 10))) {
      return NextResponse.json({ error: "La date ne peut pas être dans le passé" }, { status: 400 });
    }

    const booking = await prisma.$transaction(async (tx) => {
      const service = await tx.service.findUnique({ where: { id: serviceId } });
      if (!service || !service.active) {
        throw new Error("Service introuvable ou inactif");
      }

      // Trouver ou vérifier le créneau (capacité par service + heure)
      const slot = await tx.timeSlot.findUnique({
        where: { serviceId_date_time: { serviceId, date: dayStart, time } },
        include: { _count: { select: { bookings: true } } },
      });

      if (!slot) {
        throw new Error("Ce créneau n'existe pas ou n'est plus proposé");
      }
      if (slot._count.bookings >= slot.capacity) {
        throw new Error("Ce créneau est complet, choisis un autre horaire");
      }

      return tx.booking.create({
        data: {
          service: service.title,
          date: dayStart,
          time,
          fromLocation,
          toLocation,
          passengers: passengers ?? 1,
          hasLuggage: hasLuggage ?? false,
          specialRequests,
          customerName,
          customerEmail,
          customerPhone,
          price: service.price,
          status: "pending",
          timeSlotId: slot.id,
        },
      });
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Échec de la réservation" },
      { status: 400 }
    );
  }
}

// GET /api/bookings?email=  (historique des réservations d'un client)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const status = searchParams.get("status");

    const where: any = {};
    if (email) where.customerEmail = email;
    if (status && status !== "all") where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { date: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}