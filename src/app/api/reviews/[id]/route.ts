import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {auth} from "@/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.review.delete({ where: { id: Number(id) } });

  return NextResponse.json({ success: true });
}