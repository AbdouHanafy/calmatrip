import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { sendPushToRole, sendPushToUser } from "@/lib/push";
import { sendBookingConfirmationEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

interface BookingPayload {
  serviceId: number;

  tripType: "one-way" | "round-trip";

  date: string;
  time: string;

  returnDate?: string;
  returnTime?: string;

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
      tripType,
      date,
      time,
      returnDate,
      returnTime,
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
      !tripType ||
      !date ||
      !time ||
      !fromLocation ||
      !toLocation ||
      !customerName ||
      !customerEmail
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      tripType === "round-trip" &&
      (!returnDate || !returnTime)
    ) {
      return NextResponse.json(
        {
          error: "Return date and return time are required.",
        },
        {
          status: 400,
        }
      );
    }

    const departureDate = new Date(`${date}T00:00:00.000Z`);

    if (isNaN(departureDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid departure date",
        },
        {
          status: 400,
        }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (departureDate < today) {
      return NextResponse.json(
        {
          error: "Departure date cannot be in the past",
        },
        {
          status: 400,
        }
      );
    }

    let returnDateObject: Date | null = null;

    if (tripType === "round-trip") {
      returnDateObject = new Date(`${returnDate}T00:00:00.000Z`);

      if (isNaN(returnDateObject.getTime())) {
        return NextResponse.json(
          {
            error: "Invalid return date",
          },
          {
            status: 400,
          }
        );
      }

      if (returnDateObject < departureDate) {
        return NextResponse.json(
          {
            error: "Return date must be after departure date.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // Recherche utilisateur
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
        throw new Error("Service not found or inactive");
      }

      return tx.booking.create({
        data: {
          service: service.title,

          tripType,

          date: departureDate,
          time,

          returnDate: returnDateObject,
          returnTime:
            tripType === "round-trip"
              ? returnTime
              : null,

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
      createNotification({
        recipient: "admin",
        type: "booking_created",
        title: "New booking",
        body: `${customerName} booked ${booking.service}`,
        link: "/admin/bookings",
        metadata: {
          bookingId: booking.id,
          tripType,
          fromLocation,
          toLocation,
          date,
          time,
          returnDate,
          returnTime,
        },
      }),

      sendPushToRole("ADMIN", {
        title: "New booking",
        body: `${customerName} booked ${booking.service}`,
        link: "/admin/bookings",
      }),
    ];

    if (user) {
      notifications.push(
        createNotification({
          recipient: "user",
          userId: user.id,
          type: "booking_created",
          title: "Booking created",
          body: `Your booking for ${booking.service} has been received.`,
          link: "/dashboard",
          metadata: {
            bookingId: booking.id,
          },
        })
      );

      notifications.push(
        sendPushToUser(user.id, {
          title: "Booking created",
          body: `Your booking for ${booking.service} has been received.`,
          link: "/dashboard/bookings",
        })
      );
    }

    await Promise.all(notifications);

    // Envoi de l'email de confirmation — ne doit jamais faire échouer la réservation
    try {
      await sendBookingConfirmationEmail({
        customerName,
        customerEmail,
        serviceTitle: booking.service,
        tripType,
        date: booking.date.toISOString(),
        time: booking.time,
        returnDate: booking.returnDate ? booking.returnDate.toISOString() : null,
        returnTime: booking.returnTime,
        fromLocation,
        toLocation,
        passengers: booking.passengers,
        price: booking.price,
        bookingId: booking.id,
      });
    } catch (emailErr) {
      console.error("[booking email] failed to send confirmation:", emailErr);
    }

    return NextResponse.json(booking, {
      status: 201,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.message || "Booking failed",
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