import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      paidBookings,
      totalServices,
      recentBookings,
      allBookings,
    ] = await Promise.all([
      // Total bookings
      prisma.booking.count(),

      // Pending bookings
      prisma.booking.count({
        where: { status: "pending" },
      }),

      // Confirmed bookings count
      prisma.booking.count({
        where: { status: "confirmed" },
      }),

      prisma.booking.count({
        where: { status: "confirmed", paymentStatus: "paid" },
      }),

      // Total services in catalog
      prisma.service.count(),

      // Recent bookings — flat model, no user relation
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          customerName: true,
          customerEmail: true,
          service: true,
          date: true,
          status: true,
          price: true,
        },
      }),

      // All bookings for revenue + top-services aggregation
      prisma.booking.findMany({
        select: { service: true, status: true, paymentStatus: true, price: true },
      }),
    ]);

    // Revenue: price is stored as "35 TND" — extract the numeric part
    const revenue = allBookings
      .filter((b) => b.status === "confirmed" && b.paymentStatus === "paid")
      .reduce((sum, b) => {
        const n = parseFloat(b.price?.replace(/[^\d,.-]/g, "").replace(",", ".") ?? "0");
        return sum + (isNaN(n) ? 0 : n);
      }, 0);

    // Unique clients by distinct customerEmail
    const distinctClients = await prisma.booking
      .findMany({
        where: { customerEmail: { not: null } },
        select: { customerEmail: true },
        distinct: ["customerEmail"],
      })
      .then((rows) => rows.length);

    // Top services: group by service string field
    const serviceCountMap = new Map<string, number>();
    for (const b of allBookings) {
      if (!b.service || b.status !== "confirmed") continue;
      serviceCountMap.set(b.service, (serviceCountMap.get(b.service) ?? 0) + 1);
    }

    const sorted = [...serviceCountMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    const maxCount = sorted[0]?.[1] ?? 1;

    const topServices = sorted.map(([name, count]) => ({
      name,
      bookings: count,
      percent: Math.round((count / maxCount) * 100),
    }));

    return NextResponse.json({
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        paidBookings,
        totalClients: distinctClients,
        totalServices,
        revenue: Math.round(revenue),
      },
      recentBookings,
      topServices,
    });
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_GET]", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
