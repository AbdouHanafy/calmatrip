// app/api/notifications/read-all/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { markAllNotificationsRead } from "@/lib/notifications";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const recipient = session.user?.role === "ADMIN" ? "admin" : "user";

  await markAllNotificationsRead(recipient, session.user?.id);

  return NextResponse.json({ success: true });
}
