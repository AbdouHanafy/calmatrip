"use client";

import { useEffect } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}

export function ErrorState({ error, reset, title = "Une erreur est survenue" }: ErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-6">
          Quelque chose s&apos;est mal passé. Réessaie, ou reviens plus tard si le problème
          persiste.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Réessayer
        </button>
      </div>
    </div>
  );
}
