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

  if (b2bType === "AGENCY") {
    const bookings = await prisma.booking.findMany({
      where: { ownerId },
      orderBy: { date: "desc" },
      select: {
        id: true,
        service: true,
        date: true,
        time: true,
        status: true,
        customerName: true,
        price: true,
        commissionRate: true,
        commissionAmount: true,
      },
    });

    return NextResponse.json({ b2bType, rows: bookings });
  }

  const items = await prisma.orderItem.findMany({
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
  });

  return NextResponse.json({ b2bType, rows: items });
}
