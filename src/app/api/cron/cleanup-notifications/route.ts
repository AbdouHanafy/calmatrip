// app/api/cron/cleanup-notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // Sécurise l'endpoint (Vercel Cron envoie ce header automatiquement si tu configures CRON_SECRET)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const result = await prisma.notification.deleteMany({
    where: {
      isRead: true,
      readAt: { lte: threeDaysAgo },
    },
  });

  return NextResponse.json({ success: true, deletedCount: result.count });
}