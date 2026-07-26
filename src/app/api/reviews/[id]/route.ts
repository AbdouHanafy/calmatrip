import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteReview } from "@/repositories/reviewRepository";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteReview(Number(id));

  return NextResponse.json({ success: true });
}
