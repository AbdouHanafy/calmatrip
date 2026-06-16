import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
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
        }
      );
    }

    const bookings =
      await prisma.booking.findMany({
        where: {
          customerEmail:
            user.email || "",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const totalSpent = bookings.reduce(
      (sum, booking) =>
        sum + Number(booking.price || 0),
      0
    );

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
      }
    );
  }
}