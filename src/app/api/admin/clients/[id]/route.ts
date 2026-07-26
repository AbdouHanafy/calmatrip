import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Client introuvable",
        },
        {
          status: 404,
        },
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        customerEmail: user.email || "",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalSpent = bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        bookings,
        totalBookings: bookings.length,
        totalSpent,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erreur serveur",
      },
      {
        status: 500,
      },
    );
  }
}
