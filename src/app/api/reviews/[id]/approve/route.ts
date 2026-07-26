import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { approveReview } from "@/repositories/reviewRepository";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const review = await approveReview(Number(id));

  return NextResponse.json(review);
}
