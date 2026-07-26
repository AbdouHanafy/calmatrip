import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "B2B") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ownerId = session.user.id;
  const b2bType = session.user.b2bType;

  const me = await prisma.user.findUnique({
    where: { id: ownerId },
    select: { commissionRate: true },
  });
  const commissionRate = me?.commissionRate ?? 10;

  if (b2bType === "AGENCY") {
    const [serviceCount, bookings] = await Promise.all([
      prisma.service.count({ where: { ownerId } }),
      prisma.booking.findMany({
        where: { ownerId },
        select: { status: true, price: true, commissionAmount: true },
      }),
    ]);

    const confirmed = bookings.filter((b) => b.status === "confirmed");
    const revenue = confirmed.reduce((sum, b) => {
      const n = parseFloat(b.price?.replace(/[^\d.]/g, "") ?? "0");
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
    const commission = confirmed.reduce((sum, b) => sum + (b.commissionAmount ?? 0), 0);

    return NextResponse.json({
      b2bType,
      listingsCount: serviceCount,
      bookingsCount: bookings.length,
      confirmedCount: confirmed.length,
      revenue: Math.round(revenue * 100) / 100,
      commission: Math.round(commission * 100) / 100,
      netEarnings: Math.round((revenue - commission) * 100) / 100,
      commissionRate,
    });
  }

  // ARTISAN
  const [productCount, items] = await Promise.all([
    prisma.product.count({ where: { ownerId } }),
    prisma.orderItem.findMany({
      where: { ownerId },
      select: {
        price: true,
        quantity: true,
        commissionAmount: true,
        order: { select: { status: true } },
      },
    }),
  ]);

  const paid = items.filter((i) => ["confirmed", "shipped", "delivered"].includes(i.order.status));
  const revenue = paid.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const commission = paid.reduce((sum, i) => sum + (i.commissionAmount ?? 0), 0);

  return NextResponse.json({
    b2bType,
    listingsCount: productCount,
    bookingsCount: items.length,
    confirmedCount: paid.length,
    revenue: Math.round(revenue * 100) / 100,
    commission: Math.round(commission * 100) / 100,
    netEarnings: Math.round((revenue - commission) * 100) / 100,
    commissionRate,
  });
}
