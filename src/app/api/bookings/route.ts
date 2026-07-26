import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { sendPushToRole, sendPushToUser } from "@/lib/push";
import { sendBookingConfirmationEmail } from "@/lib/mail";
import { auth } from "@/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { bookingSchema } from "@/schemas/booking";
import { createBooking, getBookings } from "@/repositories/bookingRepository";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (!checkRateLimit(`booking:${getClientIp(req)}`, 10, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez plus tard." },
        { status: 429 },
      );
    }

    const rawBody = await req.json();
    const parsed = bookingSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

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
    } = parsed.data;

    const departureDate = new Date(`${date}T00:00:00.000Z`);

    if (isNaN(departureDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid departure date",
        },
        {
          status: 400,
        },
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
        },
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
          },
        );
      }

      if (returnDateObject < departureDate) {
        return NextResponse.json(
          {
            error: "Return date must be after departure date.",
          },
          {
            status: 400,
          },
        );
      }
    }

    // Recherche utilisateur
    const user = await prisma.user.findUnique({
      where: {
        email: customerEmail,
      },
    });

    const booking = await createBooking({
      serviceId,
      tripType,
      date: departureDate,
      time,
      returnDate: returnDateObject,
      returnTime,
      fromLocation,
      toLocation,
      passengers: passengers ?? 1,
      hasLuggage: hasLuggage ?? false,
      specialRequests,
      customerName,
      customerEmail,
      customerPhone,
    });

    const notifications: Promise<unknown>[] = [
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
        }),
      );

      notifications.push(
        sendPushToUser(user.id, {
          title: "Booking created",
          body: `Your booking for ${booking.service} has been received.`,
          link: "/dashboard/bookings",
        }),
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
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Booking failed",
      },
      {
        status: 400,
      },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const status = searchParams.get("status");
    const isAdmin = session?.user?.role === "ADMIN";

    if (email) {
      if (
        !session?.user?.email ||
        (session.user.email.toLowerCase() !== email.toLowerCase() && !isAdmin)
      ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } else if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await getBookings({ email, status });

    return NextResponse.json(bookings);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to fetch bookings",
      },
      {
        status: 500,
      },
    );
  }
}
