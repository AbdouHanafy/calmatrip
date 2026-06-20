// components/PushToggle.tsx
"use client";

import { usePushSubscription } from "@/hooks/usePushSubscription";
import { Bell, BellOff } from "lucide-react";

export default function PushToggle() {
  const { state, subscribe, unsubscribe, isSupported } = usePushSubscription();

  if (!isSupported) return null;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
      <div className="flex items-center gap-3">
        <Bell className="w-5 h-5 text-gray-600" />
        <div>
          <p className="text-sm font-medium text-gray-800">
            Notifications push
          </p>
          <p className="text-xs text-gray-400">
            {state === "granted" && "Activées sur cet appareil"}
            {state === "denied" && "Bloquées — modifie les réglages du navigateur"}
            {state === "idle" && "Recevoir les alertes en temps réel"}
            {state === "loading" && "Activation..."}
          </p>
        </div>
      </div>

      {state === "granted" ? (
        <button
          onClick={unsubscribe}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600
                     border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <BellOff className="w-3.5 h-3.5" />
          Désactiver
        </button>
      ) : (
        <button
          onClick={subscribe}
          disabled={state === "loading" || state === "denied"}
          className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-lg
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {state === "loading" ? "..." : "Activer"}
        </button>
      )}
    </div>
  );
}