// lib/push.ts
import webpush from "web-push";

// VAPID keys are optional in local/dev environments where push notifications
// aren't configured — without this guard, any route importing this module
// (even ones that never send a push) crashes on load.
const vapidConfigured =
  !!process.env.VAPID_MAILTO &&
  !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
  !!process.env.VAPID_PRIVATE_KEY;

if (vapidConfigured) {
  webpush.setVapidDetails(
    process.env.VAPID_MAILTO!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
} else {
  console.warn("[push] VAPID keys not configured — push notifications are disabled.");
}

type PushPayload = {
  title: string;
  body: string;
  link?: string;
  icon?: string;
};

type TargetSubscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

// ─── Envoyer à une liste de subscriptions ─────────────────────
export async function sendPushToSubscriptions(
  subscriptions: TargetSubscription[],
  payload: PushPayload
) {
  if (!vapidConfigured) return [];

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify(payload)
      )
    )
  );

  // Nettoyer les subscriptions expirées (410 Gone)
  const expired: string[] = [];
  results.forEach((result, i) => {
    if (
      result.status === "rejected" &&
      result.reason?.statusCode === 410
    ) {
      expired.push(subscriptions[i].endpoint);
    }
  });

  if (expired.length > 0) {
    const { prisma } = await import("@/lib/prisma");
    await prisma.pushSubscription.deleteMany({
      where: { endpoint: { in: expired } },
    });
  }

  return results;
}

// ─── Envoyer à un rôle entier (admin ou user) ─────────────────
export async function sendPushToRole(
  role: "ADMIN" | "USER",
  payload: PushPayload
) {
  const { prisma } = await import("@/lib/prisma");
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { role },
  });
  return sendPushToSubscriptions(subscriptions, payload);
}

// ─── Envoyer à un user précis ─────────────────────────────────
export async function sendPushToUser(
  userId: string,
  payload: PushPayload
) {
  const { prisma } = await import("@/lib/prisma");
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });
  return sendPushToSubscriptions(subscriptions, payload);
}