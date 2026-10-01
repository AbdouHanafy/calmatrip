"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}

// Shared by the public, dashboard, admin and B2B error boundaries, so it stays neutral:
// Calma colors, no site chrome.
export function ErrorState({ error, reset, title = "Une erreur est survenue" }: ErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white px-4 font-hanken">
      <div className="max-w-md text-center">
        <AlertTriangle size={44} strokeWidth={1.4} className="mx-auto mb-4 text-calma-olive" />
        <h2 className="m-0 mb-2 text-[24px] font-bold tracking-[-0.01em] text-calma-ink">
          {title}
        </h2>
        <p className="mb-6 mt-0 text-[15px] leading-relaxed text-calma-taupe">
          Quelque chose s&apos;est mal passé. Réessayez, ou revenez plus tard si le problème
          persiste.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-calma-olive"
          >
            <RotateCcw size={16} />
            Réessayer
          </button>
          <Link
            href="/"
            className="rounded-full border border-calma-ink/25 px-6 py-3 text-[15px] font-semibold text-calma-ink no-underline transition-colors hover:border-calma-ink/60"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
