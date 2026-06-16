import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") || "";
    const status = req.nextUrl.searchParams.get("status") || "all";

    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const clients = await Promise.all(
      users.map(async (user) => {
        const bookings = await prisma.booking.findMany({
          where: {
            customerEmail: user.email || "",
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

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone:
            bookings[0]?.customerPhone || "",
          registeredDate: user.createdAt,
          totalBookings: bookings.length,
          status:
            user.role === "BLOCKED"
              ? "blocked"
              : "active",
          lastBooking:
            bookings[0]?.createdAt || null,
          totalSpent,
          favoriteService:
            bookings[0]?.service || null,
        };
      })
    );

    const filtered =
      status === "all"
        ? clients
        : clients.filter(
            (c) => c.status === status
          );

    return NextResponse.json({
      success: true,
      data: filtered,
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