"use client";

import { Check } from "lucide-react";
import type { CalmaPartnerOnboardingDict } from "@/lib/calma/i18n";

interface OnboardingProgressProps {
  t: CalmaPartnerOnboardingDict;
  step: number;
  skipAccountStep: boolean;
  dir: "ltr" | "rtl";
}

export function OnboardingProgress({ t, step, skipAccountStep, dir }: OnboardingProgressProps) {
  const allSteps: { n: number; label: string }[] = [
    { n: 1, label: t.stepAccount },
    { n: 2, label: t.stepPartnerType },
    { n: 3, label: t.stepBusiness },
    { n: 4, label: t.stepInterests },
    { n: 5, label: t.stepPresence },
    { n: 6, label: t.stepReview },
  ];
  const steps = skipAccountStep ? allSteps.slice(1) : allSteps;
  const total = steps.length;
  const currentIndex = steps.findIndex((s) => s.n === step);

  return (
    <div className="w-full">
      {/* Compact mobile indicator */}
      <div className="mb-3 flex items-center justify-between sm:hidden">
        <span className="text-xs font-semibold text-calma-taupe">
          {t.stepWord} {currentIndex + 1} {t.ofWord} {total}
        </span>
        <span className="text-xs font-semibold text-calma-ink">{steps[currentIndex]?.label}</span>
      </div>
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-calma-ink/10 sm:hidden">
        <div
          className="h-full rounded-full bg-calma-ink transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Full stepper: equal columns, each draws the connector on its leading side so the
          line always runs circle-to-circle regardless of how long the labels are. */}
      <ol
        className="m-0 hidden list-none p-0 sm:grid"
        dir={dir}
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      >
        {steps.map((s, i) => {
          const isDone = s.n < step;
          const isCurrent = s.n === step;
          return (
            <li key={s.n} className="relative flex flex-col items-center px-1">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute start-[-50%] top-4 h-px w-full transition-colors ${
                    s.n <= step ? "bg-calma-ink" : "bg-calma-ink/15"
                  }`}
                />
              )}
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={`relative z-10 grid h-8 w-8 place-items-center rounded-full text-[12px] font-bold transition-colors ${
                  isDone
                    ? "bg-calma-ink text-white"
                    : isCurrent
                      ? "bg-calma-ink text-white ring-4 ring-calma-ink/15"
                      : "bg-calma-sand text-calma-taupe"
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={`mt-2 text-center text-[12px] font-semibold leading-tight ${
                  isCurrent ? "text-calma-ink" : "text-calma-taupe"
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
