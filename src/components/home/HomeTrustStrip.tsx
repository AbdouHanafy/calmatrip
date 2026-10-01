"use client";
import React from "react";
import { CalendarCheck, Headset, Tag, Users } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

// Same promises the site already makes elsewhere (cancellation, direct booking,
// local guides, 24/7 support) — don't add a claim here that isn't true.
const ICONS = [CalendarCheck, Tag, Users, Headset];

export default function HomeTrustStrip() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-8 sm:px-6 lg:px-8">
      <ul className="grid grid-cols-1 gap-x-8 gap-y-5 rounded-xl border border-calma-ink/10 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {t.home.trust.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <li key={item.title} className="flex items-start gap-3">
              <Icon size={22} strokeWidth={1.7} className="mt-0.5 shrink-0 text-calma-olive" />
              <div>
                <div className="text-[14.5px] font-bold text-calma-ink">{item.title}</div>
                <div className="text-[13.5px] leading-snug text-calma-taupe">{item.desc}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
