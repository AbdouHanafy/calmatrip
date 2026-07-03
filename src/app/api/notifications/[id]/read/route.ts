// app/api/notifications/[id]/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.notification.update({
    where: { id: parseInt((await params).id) },
    data: { isRead: true, readAt: new Date() },
  });

  return NextResponse.json({ success: true });
}