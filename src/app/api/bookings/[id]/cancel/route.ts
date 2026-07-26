import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id: bookingId } = await params;

    const id = parseInt(bookingId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Identifiant de réservation invalide" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
    }

    const isOwner = booking.customerEmail?.toLowerCase() === session.user.email.toLowerCase();
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "Cette réservation est déjà annulée." }, { status: 409 });
    }

    // Free cancellation up to 24h before departure (per site policy) — admins can override.
    if (!isAdmin) {
      const [hours, minutes] = (booking.time || "00:00")
        .split(":")
        .map((n) => parseInt(n, 10) || 0);
      const departure = new Date(booking.date);
      departure.setUTCHours(hours, minutes, 0, 0);

      const cutoff = new Date(Date.now() + 24 * 60 * 60 * 1000);
      if (departure < cutoff) {
        return NextResponse.json(
          {
            error:
              "Cette réservation a lieu dans moins de 24h — l'annulation en ligne n'est plus possible. Contactez-nous directement.",
          },
          { status: 409 },
        );
      }
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

    return NextResponse.json({ error: "Échec de l'annulation" }, { status: 500 });
  }
}
