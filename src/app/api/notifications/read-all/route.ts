// app/api/notifications/read-all/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { markAllNotificationsRead } from "@/lib/notifications";

export async function PATCH() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const recipient = session.user?.role === "ADMIN" ? "admin" : "user";

  await markAllNotificationsRead(recipient, session.user?.id);

  return NextResponse.json({ success: true });
}
