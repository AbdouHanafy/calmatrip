"use client";
import React from "react";
import { Search, CalendarCheck, Smile } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

const ICONS = [Search, CalendarCheck, Smile];

export default function HomeHowItWorks() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="m-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]">
        {t.home.howHeading}
      </h2>
      <ol className="m-0 mt-5 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
        {t.home.howSteps.map((step, i) => {
          const Icon = ICONS[i];
          return (
            <li key={step.title} className="rounded-2xl border border-calma-ink/10 p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-calma-ink text-[15px] font-bold text-white">
                  {i + 1}
                </span>
                <Icon size={24} strokeWidth={1.6} className="text-calma-olive" />
              </div>
              <h3 className="m-0 text-[17px] font-bold text-calma-ink">{step.title}</h3>
              <p className="mb-0 mt-2 text-[14.5px] leading-relaxed text-calma-taupe">
                {step.desc}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
