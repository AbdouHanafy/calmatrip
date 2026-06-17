import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;

    const id = parseInt(bookingId, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Identifiant de réservation invalide" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    if (booking.status !== "pending") {
      return NextResponse.json(
        {
          error: `Impossible d'annuler une réservation déjà ${
            booking.status === "confirmed"
              ? "confirmée"
              : "annulée"
          }`,
        },
        { status: 409 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: "cancelled",
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Échec de l'annulation" },
      { status: 500 }
    );
  }
}