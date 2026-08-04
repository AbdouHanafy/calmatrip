import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, services, exploreListings] = await Promise.all([
    prisma.product.findMany({
      where: { ownerId: { not: null } },
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { name: true, email: true } } },
    }),
    prisma.service.findMany({
      where: { ownerId: { not: null } },
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { name: true, email: true } } },
    }),
    prisma.exploreListing.findMany({
      where: { ownerId: { not: null } },
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { name: true, email: true } } },
    }),
  ]);

  return NextResponse.json({ products, services, exploreListings });
}
