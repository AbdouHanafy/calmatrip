// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ─── GET — récupère les notifs selon le rôle ──────────────────
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const onlyUnread = searchParams.get("unread") === "true";

  const isAdmin = session.user.role === "ADMIN";

  const where = {
    ...(isAdmin
      ? { recipient: "admin" } // ADMIN => toutes les notifications, sans restriction
      : { userId: session.user.id }), // USER => uniquement les siennes
    ...(onlyUnread ? { isRead: false } : {}),
  };

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.notification.count({
      where: { ...where, isRead: false },
    }),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}