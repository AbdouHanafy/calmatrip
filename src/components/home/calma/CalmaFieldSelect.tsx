"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

export function CalmaFieldSelect({
  value,
  options,
  onChange,
  triggerClassName = "",
}: {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full cursor-pointer items-center justify-between gap-1.5 truncate bg-transparent p-0 text-start font-hanken outline-none ${triggerClassName}`}
      >
        <span className="truncate">{current?.label ?? value}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 text-calma-taupe transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute start-0 top-full z-30 mt-2 max-h-64 w-max min-w-[170px] overflow-auto rounded-2xl border border-calma-olive/10 bg-calma-cream p-1.5 shadow-[0_22px_50px_-22px_rgba(21,36,46,.5)]">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`block w-full truncate rounded-xl px-3 py-2.5 text-start text-sm font-medium outline-none transition-colors ${
                opt.value === value
                  ? "bg-calma-terracotta/10 text-calma-terracotta"
                  : "text-calma-ink hover:bg-calma-terracotta/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
