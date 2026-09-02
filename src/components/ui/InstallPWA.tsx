"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;

    setLoading(true);

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    setLoading(false);

    if (choiceResult.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (!deferredPrompt || !visible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100vw-2.5rem)] max-w-[320px] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl bg-white shadow-xl border border-gray-200 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Download size={18} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Installer Calmatrip</p>
          <p className="text-xs text-gray-500">Accès rapide comme une app</p>
        </div>

        <button
          onClick={install}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
        >
          {loading ? "…" : "Installer"}
        </button>
        <button
          onClick={() => setVisible(false)}
          aria-label="Fermer"
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
