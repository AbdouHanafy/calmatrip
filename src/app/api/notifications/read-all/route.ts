// app/api/notifications/read-all/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const recipient = session.user?.role === "ADMIN" ? "admin" : "user";

  await prisma.notification.updateMany({
    where: {
      OR: [{ recipient }, { userId: session.user?.id }],
      isRead: false,
    },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}