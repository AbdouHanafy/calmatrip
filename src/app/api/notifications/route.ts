// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getNotifications } from "@/lib/notifications";

// ─── GET — récupère les notifs selon le rôle ──────────────────
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const onlyUnread = searchParams.get("unread") === "true";
  const isAdmin = session.user.role === "ADMIN";

  const result = await getNotifications({ isAdmin, userId: session.user.id, onlyUnread });

  return NextResponse.json(result);
}
