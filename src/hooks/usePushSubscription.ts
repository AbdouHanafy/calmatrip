// hooks/usePushSubscription.ts
"use client";

import { useEffect, useState } from "react";

type PushState = "idle" | "loading" | "granted" | "denied" | "unsupported";

export function usePushSubscription() {
  const [state, setState] = useState<PushState>("idle");

  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  // ─── Vérifier l'état actuel au mount ────────────────────────
  useEffect(() => {
  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  setIsSupported(supported);

  if (!supported) {
    setState("unsupported");
    return;
  }

  const checkPermission = async () => {
    const permission = Notification.permission;

    if (permission === "denied") {
      setState("denied");
      return;
    }

    if (permission === "granted") {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();

      if (existing) {
        setState("granted");
      }
    }
  };

  checkPermission();
}, []);

  // ─── S'abonner ───────────────────────────────────────────────
  const subscribe = async () => {
    if (!isSupported) return;
    setState("loading");

    try {
      const reg = await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      // Convertir la clé VAPID publique
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
      const applicationServerKey = urlBase64ToUint8Array(vapidKey);

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      // Envoyer au serveur
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      setState("granted");
    } catch (err) {
      console.error("Push subscription error:", err);
      setState("idle");
    }
  };

  // ─── Se désabonner ───────────────────────────────────────────
  const unsubscribe = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }

      setState("idle");
    } catch (err) {
      console.error("Unsubscribe error:", err);
    }
  };

  return { state, subscribe, unsubscribe, isSupported };
}

// ─── Helper VAPID ─────────────────────────────────────────────
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}