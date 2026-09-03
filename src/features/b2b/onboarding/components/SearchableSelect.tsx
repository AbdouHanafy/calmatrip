"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export interface SearchableOption {
  value: string;
  label: string;
  hint?: string;
}

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableOption[];
  placeholder: string;
  error?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
}: SearchableSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-calma-ink">
        {label}
      </label>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white/80 px-4 text-[15px] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-red-300" : "border-calma-olive/15 focus:border-calma-terracotta"
        } ${open ? "border-calma-terracotta shadow-[0_0_0_4px_rgba(210,179,139,.12)]" : ""}`}
      >
        <span className={selected ? "text-calma-ink" : "text-calma-taupe/60"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className="shrink-0 text-calma-taupe" />
      </button>

      {open && !disabled && (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-calma-olive/15 bg-white shadow-[0_20px_45px_-15px_rgba(15,12,8,.3)]">
          <div className="flex items-center gap-2 border-b border-calma-border px-3 py-2">
            <Search size={15} className="shrink-0 text-calma-taupe" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full border-none bg-transparent text-sm text-calma-ink outline-none placeholder:text-calma-taupe/60"
            />
          </div>
          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-2.5 text-sm text-calma-taupe">No results.</li>
            )}
            {filtered.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-calma-sand ${
                    opt.value === value
                      ? "bg-calma-terracotta/10 text-calma-terracotta font-semibold"
                      : "text-calma-ink"
                  }`}
                >
                  {opt.label}
                  {opt.hint && <span className="text-xs text-calma-taupe">{opt.hint}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
