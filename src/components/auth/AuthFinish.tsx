"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function AuthFinishInner() {
  const params = useSearchParams();
  const [error, setError] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const type = params.get("type");

    (async () => {
      try {
        if (type === "artisan" || type === "agency") {
          const res = await fetch("/api/auth/apply-account-type", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type }),
          });
          if (!res.ok) throw new Error("apply-account-type failed");
          // Hard navigation — the session callback in auth.ts always reads
          // role/b2bType/b2bStatus fresh from the DB, so middleware on /b2b
          // sees the just-applied B2B role immediately, no cookie race.
          window.location.href = "/b2b";
        } else {
          window.location.href = "/dashboard";
        }
      } catch {
        setError(true);
      }
    })();
  }, [params]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-calma-sand px-4 font-hanken">
      <div className="flex flex-col items-center gap-4 text-center">
        {error ? (
          <>
            <p className="font-fraunces text-lg text-calma-ink">Une erreur est survenue</p>
            <p className="text-sm text-calma-taupe">
              Votre connexion a réussi, mais nous n&apos;avons pas pu finaliser votre profil
              partenaire.{" "}
              <Link href="/dashboard" className="font-semibold text-calma-terracotta">
                Continuer vers mon espace
              </Link>
            </p>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-calma-terracotta" />
            <p className="text-sm text-calma-taupe">Finalisation de votre compte partenaire...</p>
          </>
        )}
      </div>
    </div>
  );
}

export function AuthFinish() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-calma-sand">
          <Loader2 className="h-8 w-8 animate-spin text-calma-terracotta" />
        </div>
      }
    >
      <AuthFinishInner />
    </Suspense>
  );
}
