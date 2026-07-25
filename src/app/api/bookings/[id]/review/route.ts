import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// POST /api/bookings/[id]/review — leave a review for a specific completed booking.
// Only the traveler who made the booking (matched by session email) can review it,
// only once the activity date has passed, and only once per booking.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const bookingId = parseInt(id);
  if (isNaN(bookingId)) {
    return NextResponse.json({ error: "Réservation invalide" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true },
  });

  if (!booking || booking.customerEmail?.toLowerCase() !== session.user.email.toLowerCase()) {
    return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
  }

  if (booking.status.toLowerCase() !== "confirmed") {
    return NextResponse.json({ error: "Seules les réservations confirmées peuvent être notées." }, { status: 400 });
  }

  if (booking.date > new Date()) {
    return NextResponse.json({ error: "Vous pourrez laisser un avis une fois l'activité terminée." }, { status: 400 });
  }

  if (booking.review) {
    return NextResponse.json({ error: "Vous avez déjà laissé un avis pour cette réservation." }, { status: 409 });
  }

  const body = await req.json().catch(() => ({}));
  const rating = Number(body.rating);
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Note invalide" }, { status: 400 });
  }
  if (comment.length < 10) {
    return NextResponse.json({ error: "Votre commentaire doit contenir au moins 10 caractères." }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      name: session.user.name ?? booking.customerName ?? "Voyageur",
      email: session.user.email,
      avatar: session.user.image ?? null,
      rating,
      comment,
      service: booking.service,
      approved: false,
      bookingId: booking.id,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
