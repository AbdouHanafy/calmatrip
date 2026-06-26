import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all"); // admin only

  const session = await auth();

  if (all && session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    where: all ? {} : { approved: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { rating, comment, service } = body;

  if (!rating || !comment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      name: session.user.name ?? "Anonyme",
      email: session.user.email ?? "",
      avatar: session.user.image ?? null,
      rating,
      comment,
      service: service ?? null,
      approved: false,
    },
  });

  return NextResponse.json(review, { status: 201 });
}