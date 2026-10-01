"use client";

import { useState } from "react";
import { MultiSelectCards } from "./MultiSelectCards";
import { StepActions } from "./StepActions";
import { interestCategoriesFor, type PartnerType } from "@/lib/partners/constants";
import type { CalmaPartnerOnboardingDict } from "@/lib/calma/i18n";

interface InterestsStepProps {
  t: CalmaPartnerOnboardingDict;
  partnerType: PartnerType;
  selected: string[];
  onChange: (interests: string[]) => void;
  onBack: () => void;
  onContinue: () => Promise<boolean>;
  saving: boolean;
}

const CATEGORY_LABEL_KEY: Record<string, keyof CalmaPartnerOnboardingDict> = {
  Transport: "catTransport",
  Excursion: "catExcursion",
  Activity: "catActivity",
  "Food & Drink": "catFoodDrink",
  Sight: "catSight",
  "Hidden Gem": "catHiddenGem",
  Hotel: "catHotel",
};

export function InterestsStep({
  t,
  partnerType,
  selected,
  onChange,
  onBack,
  onContinue,
  saving,
}: InterestsStepProps) {
  const [error, setError] = useState<string | null>(null);
  const categories = interestCategoriesFor(partnerType);
  const options = categories.map((c) => ({
    value: c,
    label: CATEGORY_LABEL_KEY[c] ? t[CATEGORY_LABEL_KEY[c]] : c,
  }));

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    setError(null);
  };

  const handleContinue = async () => {
    if (selected.length === 0) {
      setError(t.interestsErrorRequired);
      return;
    }
    await onContinue();
  };

  return (
    <div>
      <h2 className="mb-1 text-[22px] font-bold tracking-[-0.01em] text-calma-ink">
        {partnerType === "ARTISAN" ? t.interestsArtisanTitle : t.interestsAgencyTitle}
      </h2>
      <p className="mb-5 text-[13.5px] text-calma-taupe">{t.interestsSub}</p>

      <MultiSelectCards options={options} selected={selected} onToggle={toggle} />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <StepActions
        onBack={onBack}
        onContinue={handleContinue}
        backLabel={t.backBtn}
        continueLabel={t.continueBtn}
        loading={saving}
      />
    </div>
  );
}
