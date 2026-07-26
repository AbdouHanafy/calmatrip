// app/api/notifications/[id]/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getNotificationById, markNotificationRead } from "@/lib/notifications";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt((await params).id);
  const notification = await getNotificationById(id);
  if (!notification) {
    return NextResponse.json({ error: "Notification introuvable" }, { status: 404 });
  }

  const isOwner = notification.userId === session.user.id;
  const isAdminNotif = notification.recipient === "admin" && session.user.role === "ADMIN";
  if (!isOwner && !isAdminNotif) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await markNotificationRead(id);

  return NextResponse.json({ success: true });
}
