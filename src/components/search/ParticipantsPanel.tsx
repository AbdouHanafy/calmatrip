"use client";
import React from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

function Counter({
  label,
  hint,
  value,
  min,
  canAdd,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  canAdd: boolean;
  onChange: (n: number) => void;
}) {
  const { t } = useCalmaLang();
  const btn =
    "grid h-8 w-8 place-items-center rounded-full border border-calma-ink/30 text-calma-ink transition-colors hover:border-calma-ink disabled:cursor-not-allowed disabled:border-calma-ink/10 disabled:text-calma-ink/25";
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div>
        <div className="text-[15px] font-semibold text-calma-ink">{label}</div>
        <div className="text-[13px] text-calma-taupe">{hint}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={t.search.fewer.replace("{who}", label)}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className={btn}
        >
          <Minus size={15} />
        </button>
        <output
          aria-live="polite"
          className="w-8 text-center text-[15px] font-semibold text-calma-ink"
        >
          {value}
        </output>
        <button
          type="button"
          aria-label={t.search.more.replace("{who}", label)}
          disabled={!canAdd}
          onClick={() => onChange(value + 1)}
          className={btn}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

export default function ParticipantsPanel({
  adults,
  childCount,
  max,
  onChange,
}: {
  adults: number;
  childCount: number;
  /** Admin-set cap on adults + children (Site Settings → Search). */
  max: number;
  onChange: (next: { adults: number; children: number }) => void;
}) {
  const { t } = useCalmaLang();
  const s = t.search;
  const canAdd = adults + childCount < max;

  return (
    <div className="px-5 py-2">
      <Counter
        label={s.adults}
        hint={s.adultsHint}
        value={adults}
        min={1}
        canAdd={canAdd}
        onChange={(n) => onChange({ adults: n, children: childCount })}
      />
      <div className="h-px bg-calma-ink/10" />
      <Counter
        label={s.children}
        hint={s.childrenHint}
        value={childCount}
        min={0}
        canAdd={canAdd}
        onChange={(n) => onChange({ adults, children: n })}
      />
      {!canAdd && (
        <p className="mb-2 mt-1 text-[13px] text-calma-taupe">
          {s.groupHint.replace("{n}", String(max))}{" "}
          <Link href="/contact" className="font-semibold text-calma-ink underline">
            {s.groupHintLink}
          </Link>
        </p>
      )}
    </div>
  );
}
