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

  return (
    <div>
      {/* Compact mobile indicator */}
      <div className="mb-3 flex items-center justify-between sm:hidden">
        <span className="text-xs font-semibold text-calma-taupe">
          {t.stepWord} {steps.findIndex((s) => s.n === step) + 1} {t.ofWord} {total}
        </span>
        <span className="text-xs font-semibold text-calma-terracotta">
          {steps.find((s) => s.n === step)?.label}
        </span>
      </div>
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-calma-olive/10 sm:hidden">
        <div
          className="h-full rounded-full bg-calma-terracotta transition-all duration-500"
          style={{
            width: `${((steps.findIndex((s) => s.n === step) + 1) / total) * 100}%`,
          }}
        />
      </div>

      {/* Full stepper */}
      <div className="hidden items-center sm:flex" dir={dir}>
        {steps.map((s, i) => {
          const isDone = s.n < step;
          const isCurrent = s.n === step;
          return (
            <div key={s.n} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isDone
                      ? "bg-calma-success text-white"
                      : isCurrent
                        ? "bg-calma-terracotta text-white shadow-[0_6px_16px_-6px_rgba(242,153,74,.7)]"
                        : "bg-calma-olive/10 text-calma-taupe"
                  }`}
                >
                  {isDone ? <Check size={14} strokeWidth={3} /> : String(i + 1).padStart(2, "0")}
                </div>
                <span
                  className={`max-w-[70px] text-center text-[10.5px] font-medium leading-tight ${
                    isCurrent ? "text-calma-ink" : "text-calma-taupe"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-1.5 mb-4 h-px flex-1 transition-colors ${
                    isDone ? "bg-calma-success" : "bg-calma-olive/15"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
