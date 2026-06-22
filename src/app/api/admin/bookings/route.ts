import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";
import { sendPushToRole, sendPushToUser } from "@/lib/push";

// GET /api/admin/bookings?status=all&search=&page=1
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "all";
    const search = searchParams.get("search") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = 10;

    const where = {
      ...(status !== "all" && { status }),
      ...(search && {
        OR: [
          { customerName: { contains: search } },
          { customerEmail: { contains: search } },
          { service: { contains: search } },
        ],
      }),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    // Stats (always over all bookings, ignoring filters)
    const [totalCount, confirmedCount, pendingCount, allForRevenue] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "confirmed" } }),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.booking.findMany({ select: { price: true, status: true } }),
    ]);

    const revenue = allForRevenue
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => {
        const n = parseFloat(b.price?.replace(/[^\d.]/g, "") ?? "0");
        return sum + (isNaN(n) ? 0 : n);
      }, 0);

    return NextResponse.json({
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: totalCount,
        confirmed: confirmedCount,
        pending: pendingCount,
        revenue: Math.round(revenue),
      },
    });
  } catch (error) {
    console.error("[ADMIN_BOOKINGS_GET]", error);
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 });
  }
}

// PATCH /api/admin/bookings/:id  — update status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body as { id: number; status: string };

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid id or status" },
        { status: 400 }
      );
    }

    // 1. récupérer booking actuelle
    const existing = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // 2. update booking
    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    // 3. notifications
    const notifications: Promise<any>[] = [];

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
          })
        );

        notifications.push(
          sendPushToUser(user.id, {
            title: "Mise à jour réservation",
            body: `Statut: ${status}`,
            link: "/dashboard/bookings",
          })
        );
      }
    }
    await Promise.all(notifications);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[ADMIN_BOOKINGS_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/bookings/:id
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") ?? "");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_BOOKINGS_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}