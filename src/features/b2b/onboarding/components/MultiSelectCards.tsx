"use client";

import { Check } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectCardsProps {
  options: MultiSelectOption[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function MultiSelectCards({ options, selected, onToggle }: MultiSelectCardsProps) {
  return (
    <div role="group" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            onClick={() => onToggle(opt.value)}
            className={`relative flex flex-col items-start gap-1 rounded-2xl border px-4 py-4 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-calma-terracotta ${
              isSelected
                ? "border-calma-terracotta bg-calma-terracotta/10 shadow-[0_10px_25px_-12px_rgba(242,153,74,.5)]"
                : "border-calma-olive/15 bg-white/70 hover:border-calma-olive/35"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                isSelected
                  ? "border-calma-terracotta bg-calma-terracotta text-white"
                  : "border-calma-olive/30 bg-white"
              }`}
            >
              {isSelected && <Check size={12} strokeWidth={3} />}
            </span>
            <span
              className={`text-[14px] font-semibold ${isSelected ? "text-calma-terracotta" : "text-calma-ink"}`}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
