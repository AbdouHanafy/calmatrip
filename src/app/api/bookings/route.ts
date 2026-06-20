import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { sendPushToRole, sendPushToUser } from "@/lib/push";

export const dynamic = "force-dynamic";

interface BookingPayload {
  serviceId: number;
  date: string;
  time: string;
  fromLocation: string;
  toLocation: string;
  passengers?: number;
  hasLuggage?: boolean;
  specialRequests?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

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

    if (
      !serviceId ||
      !date ||
      !time ||
      !fromLocation ||
      !toLocation ||
      !customerName ||
      !customerEmail
    ) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const dayStart = new Date(`${date}T00:00:00.000Z`);

    if (isNaN(dayStart.getTime())) {
      return NextResponse.json(
        { error: "Date invalide" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dayStart < today) {
      return NextResponse.json(
        { error: "La date ne peut pas être dans le passé" },
        { status: 400 }
      );
    }

    // Recherche du user via email
    const user = await prisma.user.findUnique({
      where: {
        email: customerEmail,
      },
    });

    const booking = await prisma.$transaction(async (tx) => {
      const service = await tx.service.findUnique({
        where: {
          id: serviceId,
        },
      });

      if (!service || !service.active) {
        throw new Error("Service introuvable ou inactif");
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
        },
      });
    });

    const notifications: Promise<any>[] = [
      // Notification admin
      createNotification({
        recipient: "admin",
        type: "booking_created",
        title: "Nouvelle réservation",
        body: `${customerName} a réservé ${booking.service}`,
        link: "/admin/bookings",
        metadata: {
          bookingId: booking.id,
          fromLocation,
          toLocation,
          date,
          time,
        },
      }),

      // Push admin
      sendPushToRole("ADMIN", {
        title: "Nouvelle réservation",
        body: `${customerName} a réservé ${booking.service}`,
        link: "/admin/bookings",
      }),
    ];

    // Notification utilisateur connecté
    if (user) {
      notifications.push(
        createNotification({
          recipient: "user",
          userId: user.id,
          type: "booking_created",
          title: "Réservation créée",
          body: `Votre réservation pour ${booking.service} a été enregistrée`,
          link: "/dashboard",
          metadata: {
            bookingId: booking.id,
          },
        })
      );

      notifications.push(
        sendPushToUser(user.id, {
          title: "Réservation créée",
          body: `Votre réservation pour ${booking.service} a été enregistrée`,
          link: "/dashboard/bookings",
        })
      );
    }

    await Promise.all(notifications);

    return NextResponse.json(booking, {
      status: 201,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.message || "Échec de la réservation",
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const status = searchParams.get("status");

    const where: any = {};

    if (email) {
      where.customerEmail = email;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to fetch bookings",
      },
      {
        status: 500,
      }
    );
  }
}