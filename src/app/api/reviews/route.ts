import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { reviewSchema } from "@/schemas/review";
import { createReview, getAllReviews, getApprovedReviews } from "@/repositories/reviewRepository";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all"); // admin only

  const session = await auth();

  if (all && session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (all) {
    const reviews = await getAllReviews();
    return NextResponse.json(reviews);
  }

  const reviews = await getApprovedReviews();
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const rawBody = await req.json();
  const parsed = reviewSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { rating, comment, service } = parsed.data;

  const review = await createReview({
    name: session.user.name ?? "Anonyme",
    email: session.user.email ?? "",
    avatar: session.user.image ?? null,
    rating,
    comment,
    service: service ?? null,
  });

  return NextResponse.json(review, { status: 201 });
}
