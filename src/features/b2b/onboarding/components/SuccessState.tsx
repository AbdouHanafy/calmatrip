"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { CalmaPartnerOnboardingDict } from "@/lib/calma/i18n";

export function SuccessState({ t }: { t: CalmaPartnerOnboardingDict }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-calma-success/15 text-calma-success">
        <CheckCircle2 size={32} strokeWidth={2} />
      </div>
      <h2 className="mb-2 font-fraunces text-[24px] font-normal text-calma-ink">
        {t.successTitle}
      </h2>
      <p className="mx-auto max-w-[380px] text-[14px] leading-relaxed text-calma-taupe">
        {t.successSub}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-calma-sand px-6 py-2.5 text-sm font-semibold text-calma-ink transition-colors hover:bg-calma-border"
      >
        {t.successBackBtn}
      </Link>
    </div>
  );
}
