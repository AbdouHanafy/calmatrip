import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalClients = await prisma.user.count();

    const activeClients = await prisma.user.count({
      where: {
        status: "active",
      },
    });

    const blockedClients = await prisma.user.count({
      where: {
        status: "blocked",
      },
    });

    const totalBookings = await prisma.booking.count();

    return NextResponse.json({
      totalClients,
      activeClients,
      blockedClients,
      totalBookings,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Erreur serveur",
      },
      {
        status: 500,
      },
    );
  }
}
