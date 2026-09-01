"use client";

import { useState } from "react";
import { SocialProfileFields } from "./SocialProfileFields";
import { StepActions } from "./StepActions";
import type { SocialPlatform } from "@/lib/partners/constants";
import type { SocialProfileValue } from "../types";
import type { CalmaPartnerOnboardingDict } from "@/lib/calma/i18n";

interface OnlinePresenceStepProps {
  t: CalmaPartnerOnboardingDict;
  value: SocialProfileValue[];
  onChange: (value: SocialProfileValue[]) => void;
  onBack: () => void;
  onContinue: () => Promise<boolean>;
  saving: boolean;
}

function isValidUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function OnlinePresenceStep({
  t,
  value,
  onChange,
  onBack,
  onContinue,
  saving,
}: OnlinePresenceStepProps) {
  const [errors, setErrors] = useState<Partial<Record<SocialPlatform, string>>>({});

  const handleContinue = async () => {
    const next: Partial<Record<SocialPlatform, string>> = {};
    for (const p of value) {
      if (!p.url.trim() || !isValidUrl(p.url.trim())) next[p.platform] = t.invalidUrlError;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    await onContinue();
  };

  return (
    <div>
      <h2 className="mb-1 font-fraunces text-[22px] font-normal text-calma-ink">
        {t.presenceTitle}
      </h2>
      <p className="mb-5 text-[13.5px] text-calma-taupe">{t.presenceSub}</p>

      <SocialProfileFields t={t} value={value} onChange={onChange} errors={errors} />

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
