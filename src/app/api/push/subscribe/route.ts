// app/api/push/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    console.log("[PUSH] Session:", session?.user?.id, session?.user?.role);
    
    if (!session) {
      console.warn("[PUSH] No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      console.warn("[PUSH] Invalid subscription data:", { endpoint: !!endpoint, keys: !!keys });
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    console.log("[PUSH] Saving subscription for user:", session.user?.id);
    
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: session.user?.id,
        role: session.user?.role,
        userAgent: req.headers.get("user-agent") ?? undefined,
      },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: session.user?.id,
        role: session.user?.role as string,
        userAgent: req.headers.get("user-agent") ?? undefined,
      },
    });

    console.log("[PUSH] Subscription saved successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUSH] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── Désabonnement ────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json();
  if (!endpoint) return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });

  await prisma.pushSubscription.deleteMany({ where: { endpoint } });

  return NextResponse.json({ success: true });
}