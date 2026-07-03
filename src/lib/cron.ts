// lib/cron.ts
import cron from "node-cron";
import { prisma } from "@/lib/prisma";

let started = false;

export function startCleanupCron() {
  if (started) return; // évite les doublons (hot reload dev / re-render)
  started = true;

  cron.schedule("0 3 * * *", async () => {
    try {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const result = await prisma.notification.deleteMany({
        where: {
          isRead: true,
          readAt: { lte: threeDaysAgo },
        },
      });

      console.log(`[cron] ${result.count} notifications supprimées à ${new Date().toISOString()}`);
    } catch (err) {
      console.error("[cron] erreur cleanup notifications:", err);
    }
  }, {
    timezone: "Europe/Paris", // adapte selon ton fuseau
  });

  console.log("[cron] cleanup notifications programmé (tous les jours à 3h)");
}