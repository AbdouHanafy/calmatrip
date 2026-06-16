import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalClients =
      await prisma.user.count();

    const activeClients =
      await prisma.user.count({
        where: {
          status: "active",
        },
      });

    const blockedClients =
      await prisma.user.count({
        where: {
          status: "blocked",
        },
      });

    const totalBookings =
      await prisma.booking.count();

    return NextResponse.json({
      totalClients,
      activeClients,
      blockedClients,
      totalBookings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur serveur",
      },
      {
        status: 500,
      }
    );
  }
}