"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface StepActionsProps {
  onBack?: () => void;
  onContinue: () => void;
  backLabel: string;
  continueLabel: string;
  loading?: boolean;
  disabled?: boolean;
}

export function StepActions({
  onBack,
  onContinue,
  backLabel,
  continueLabel,
  loading,
  disabled,
}: StepActionsProps) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-calma-taupe transition-colors hover:text-calma-ink"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onContinue}
        disabled={disabled || loading}
        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3 text-[15px] font-bold text-calma-cream shadow-[0_16px_32px_-12px_rgba(242,153,74,.65)] transition-shadow duration-300 hover:shadow-[0_22px_40px_-12px_rgba(242,153,74,.8)] disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundColor: "#F2994A" }}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            {continueLabel}
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </>
        )}
      </button>
    </div>
  );
}
