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
  if (session!.user.b2bType?.toUpperCase() !== "ARTISAN")
    return NextResponse.json(
      { error: "Sales are not enabled for this partner model" },
      { status: 403 },
    );
  const [items, bookings] = await Promise.all([
    prisma.orderItem.findMany({
      where: { ownerId },
      orderBy: { id: "desc" },
      select: {
        id: true,
        productName: true,
        quantity: true,
        price: true,
        commissionRate: true,
        commissionAmount: true,
        order: { select: { customerName: true, createdAt: true, status: true } },
      },
    }),
    prisma.booking.findMany({
      where: { ownerId },
      orderBy: { date: "desc" },
      select: {
        id: true,
        service: true,
        date: true,
        status: true,
        customerName: true,
        price: true,
        commissionRate: true,
        commissionAmount: true,
      },
    }),
  ]);
  const rows = [
    ...items.map((item) => ({
      id: `product-${item.id}`,
      kind: "PRODUCT",
      title: item.productName,
      quantity: item.quantity,
      customerName: item.order.customerName,
      date: item.order.createdAt,
      status: item.order.status,
      gross: item.price * item.quantity,
      commissionRate: item.commissionRate,
      commissionAmount: item.commissionAmount,
    })),
    ...bookings.map((booking) => ({
      id: `service-${booking.id}`,
      kind: "SERVICE",
      title: booking.service,
      quantity: 1,
      customerName: booking.customerName,
      date: booking.date,
      status: booking.status,
      gross:
        Number.parseFloat((booking.price ?? "0").replace(/[^0-9.,-]/g, "").replace(",", ".")) || 0,
      commissionRate: booking.commissionRate,
      commissionAmount: booking.commissionAmount,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return NextResponse.json({ b2bType: "ARTISAN", rows });
}
