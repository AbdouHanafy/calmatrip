"use client";
import React from "react";
import Link from "next/link";
import { Store } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

export default function HomePartnerBanner() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-5 rounded-2xl border border-calma-ink/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <Store size={30} strokeWidth={1.5} className="mt-1 shrink-0 text-calma-olive" />
          <div>
            <h2 className="m-0 text-[20px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[22px]">
              {t.home.partnerHeading}
            </h2>
            <p className="mb-0 mt-1.5 max-w-[620px] text-[15px] leading-relaxed text-calma-taupe">
              {t.home.partnerSub}
            </p>
          </div>
        </div>
        <Link
          href="/partner"
          className="shrink-0 rounded-full border border-calma-ink px-6 py-3 text-[15px] font-semibold text-calma-ink no-underline transition-colors hover:bg-calma-ink hover:text-white"
        >
          {t.home.partnerCta}
        </Link>
      </div>
    </section>
  );
}
