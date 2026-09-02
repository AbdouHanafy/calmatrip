import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { isApprovedPartner } from "@/lib/access";

export async function GET() {
  const session = await auth();
  if (!isApprovedPartner(session)) {
    return NextResponse.json({ error: "An approved partner account is required" }, { status: 403 });
  }

  const ownerId = session!.user.id;
  const b2bType = session!.user.b2bType;

  const me = await prisma.user.findUnique({
    where: { id: ownerId },
    select: { commissionRate: true },
  });
  const commissionRate = me?.commissionRate ?? 10;

  if (b2bType === "AGENCY") {
    const [listingsCount, approvedCount, pendingCount] = await Promise.all([
      prisma.exploreListing.count({ where: { ownerId } }),
      prisma.exploreListing.count({ where: { ownerId, submissionStatus: "approved" } }),
      prisma.exploreListing.count({ where: { ownerId, submissionStatus: "pending" } }),
    ]);

    return NextResponse.json({
      b2bType,
      listingsCount,
      approvedCount,
      pendingCount,
    });
  }

  // ARTISAN
  const [productCount, serviceCount, items, serviceBookings] = await Promise.all([
    prisma.product.count({ where: { ownerId } }),
    prisma.service.count({ where: { ownerId } }),
    prisma.orderItem.findMany({
      where: { ownerId },
      select: {
        price: true,
        quantity: true,
        commissionAmount: true,
        order: { select: { status: true } },
      },
    }),
    prisma.booking.findMany({
      where: { ownerId, status: "confirmed", paymentStatus: "paid" },
      select: { price: true, commissionAmount: true },
    }),
  ]);

  const paid = items.filter((i) => ["confirmed", "shipped", "delivered"].includes(i.order.status));
  const serviceRevenue = serviceBookings.reduce(
    (sum, booking) =>
      sum +
      (Number.parseFloat((booking.price ?? "0").replace(/[^0-9.,-]/g, "").replace(",", ".")) || 0),
    0,
  );
  const revenue = paid.reduce((sum, i) => sum + i.price * i.quantity, 0) + serviceRevenue;
  const commission =
    paid.reduce((sum, i) => sum + (i.commissionAmount ?? 0), 0) +
    serviceBookings.reduce((sum, booking) => sum + (booking.commissionAmount ?? 0), 0);

  return NextResponse.json({
    b2bType,
    listingsCount: productCount + serviceCount,
    bookingsCount: items.length + serviceBookings.length,
    confirmedCount: paid.length + serviceBookings.length,
    revenue: Math.round(revenue * 100) / 100,
    commission: Math.round(commission * 100) / 100,
    netEarnings: Math.round((revenue - commission) * 100) / 100,
    commissionRate,
  });
}
