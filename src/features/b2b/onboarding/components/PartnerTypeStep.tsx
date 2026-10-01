"use client";

import { Store, Compass, Loader2 } from "lucide-react";
import type { PartnerType } from "@/lib/partners/constants";
import type { CalmaPartnerOnboardingDict } from "@/lib/calma/i18n";

interface PartnerTypeStepProps {
  t: CalmaPartnerOnboardingDict;
  value: PartnerType | null;
  onSelect: (type: PartnerType) => void;
  loading: boolean;
}

export function PartnerTypeStep({ t, value, onSelect, loading }: PartnerTypeStepProps) {
  const cards: {
    type: PartnerType;
    icon: typeof Store;
    label: string;
    tagline: string;
    desc: string;
  }[] = [
    {
      type: "ARTISAN",
      icon: Store,
      label: t.typeArtisanLabel,
      tagline: t.typeArtisanTagline,
      desc: t.typeArtisanDesc,
    },
    {
      type: "AGENCY",
      icon: Compass,
      label: t.typeAgencyLabel,
      tagline: t.typeAgencyTagline,
      desc: t.typeAgencyDesc,
    },
  ];

  return (
    <div>
      <h2 className="mb-1 text-[22px] font-bold tracking-[-0.01em] text-calma-ink">
        {t.typeTitle}
      </h2>
      <p className="mb-5 text-[13.5px] text-calma-taupe">{t.typeSub}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const isSelected = value === card.type;
          const isBusy = loading && isSelected;
          return (
            <button
              key={card.type}
              type="button"
              disabled={loading}
              onClick={() => onSelect(card.type)}
              className={`relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-300 disabled:cursor-not-allowed ${
                isSelected
                  ? "border-calma-terracotta bg-calma-terracotta/[.06] shadow-[0_16px_40px_-18px_rgba(210,179,139,.6)]"
                  : "border-calma-olive/15 bg-white/70 hover:border-calma-olive/35 hover:shadow-[0_16px_40px_-20px_rgba(21,36,46,.25)]"
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  isSelected
                    ? "bg-calma-terracotta text-calma-ink"
                    : "bg-calma-sand text-calma-olive"
                }`}
              >
                {isBusy ? <Loader2 size={20} className="animate-spin" /> : <card.icon size={20} />}
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-calma-terracotta">
                  {card.tagline}
                </p>
                <p className="mt-0.5 text-[18px] font-bold text-calma-ink">{card.label}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-calma-taupe">{card.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
