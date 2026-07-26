import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";
import { sendPushToUser } from "@/lib/push";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { auth } from "@/auth";
import {
  deleteBooking,
  getAdminBookings,
  getBookingById,
  updateBookingStatus,
} from "@/repositories/bookingRepository";

// GET /api/admin/bookings?status=all&search=&page=1
export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "all";
    const search = searchParams.get("search") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = 10;

    const { bookings, total, stats } = await getAdminBookings({ status, search, page, limit });

    return NextResponse.json({
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("[ADMIN_BOOKINGS_GET]", error);
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 });
  }
}

// PATCH /api/admin/bookings/:id  — update status
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body as { id: number; status: string };

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid id or status" }, { status: 400 });
    }

    // 1. récupérer booking actuelle
    const existing = await getBookingById(id);

    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 2. update booking
    const updated = await updateBookingStatus(id, status);

    // 3. notifications
    const notifications: Promise<unknown>[] = [];

    // user notification (si email existe)
    if (existing.customerEmail) {
      const user = await prisma.user.findUnique({
        where: { email: existing.customerEmail },
      });

      if (user) {
        notifications.push(
          createNotification({
            recipient: "user",
            userId: user.id,
            type: "booking_status_updated",
            title: "Statut de réservation mis à jour",
            body: `Votre réservation est maintenant: ${status}`,
            link: "/dashboard/bookings",
            metadata: {
              bookingId: existing.id,
              status,
            },
          }),
        );

        notifications.push(
          sendPushToUser(user.id, {
            title: "Mise à jour réservation",
            body: `Statut: ${status}`,
            link: "/dashboard/bookings",
          }),
        );
      }
    }

    // WhatsApp — automated notification straight to the traveler's phone.
    if (existing.customerPhone && (status === "confirmed" || status === "cancelled")) {
      const message =
        status === "confirmed"
          ? `Bonjour ${existing.customerName ?? ""}, votre réservation "${existing.service}" du ${existing.date.toLocaleDateString("fr-FR")} est confirmée ! — Calma Trip`
          : `Bonjour ${existing.customerName ?? ""}, votre réservation "${existing.service}" du ${existing.date.toLocaleDateString("fr-FR")} a été annulée. — Calma Trip`;
      notifications.push(sendWhatsAppMessage(existing.customerPhone, message));
    }

    await Promise.all(notifications);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[ADMIN_BOOKINGS_PATCH]", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

// DELETE /api/admin/bookings/:id
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") ?? "");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await deleteBooking(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_BOOKINGS_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
