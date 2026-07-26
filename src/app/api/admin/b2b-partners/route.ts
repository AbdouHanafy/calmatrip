import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partners = await prisma.user.findMany({
    where: { role: "B2B" },
    select: {
      id: true,
      name: true,
      email: true,
      b2bType: true,
      b2bStatus: true,
      commissionRate: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const [bookingSums, orderItemSums] = await Promise.all([
    // Only confirmed bookings count as earned commission — pending/cancelled don't.
    prisma.booking.groupBy({
      by: ["ownerId"],
      where: { ownerId: { not: null }, status: "confirmed" },
      _sum: { commissionAmount: true },
    }),
    // Only paid/fulfilled orders count as earned commission.
    prisma.orderItem.groupBy({
      by: ["ownerId"],
      where: {
        ownerId: { not: null },
        order: { status: { in: ["confirmed", "shipped", "delivered"] } },
      },
      _sum: { commissionAmount: true },
    }),
  ]);

  const commissionByOwner = new Map<string, number>();
  for (const row of bookingSums) {
    if (!row.ownerId) continue;
    commissionByOwner.set(
      row.ownerId,
      (commissionByOwner.get(row.ownerId) ?? 0) + (row._sum.commissionAmount ?? 0),
    );
  }
  for (const row of orderItemSums) {
    if (!row.ownerId) continue;
    commissionByOwner.set(
      row.ownerId,
      (commissionByOwner.get(row.ownerId) ?? 0) + (row._sum.commissionAmount ?? 0),
    );
  }

  const result = partners.map((p) => ({
    ...p,
    commissionEarned: Math.round((commissionByOwner.get(p.id) ?? 0) * 100) / 100,
  }));

  return NextResponse.json(result);
}
