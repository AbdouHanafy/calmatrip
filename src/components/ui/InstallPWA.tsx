"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
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
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 rounded-2xl bg-white shadow-xl border border-gray-200 px-4 py-3 w-[320px]">
  
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Download size={18} />
        </div>
  
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">
            Installer Calmatrip
          </p>
          <p className="text-xs text-gray-500">
            Accès rapide comme une app
          </p>
        </div>
  
        <button
          onClick={install}
          className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
        >
          Installer
        </button>
      </div>
    </div>
  );
}