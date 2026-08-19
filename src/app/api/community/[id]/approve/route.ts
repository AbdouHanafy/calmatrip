import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { approvePost } from "@/repositories/communityRepository";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await approvePost(Number(id));

  return NextResponse.json(post);
}
