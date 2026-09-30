"use client";
import React, { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import {
  addDays,
  addMonths,
  fromISODate,
  monthGrid,
  nextWeekendSaturday,
  startOfDay,
  toISODate,
} from "./dates";

export const DATE_LOCALES = { fr: "fr-FR", en: "en-GB", ar: "ar-TN" } as const;

function MonthView({
  month,
  locale,
  today,
  selected,
  onPick,
}: {
  month: Date;
  locale: string;
  today: Date;
  selected: string | null;
  onPick: (iso: string) => void;
}) {
  const title = month.toLocaleDateString(locale, { month: "long", year: "numeric" });
  // Monday-first weekday names: 2024-01-01 was a Monday.
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: "short" }),
  );
  const todayISO = toISODate(today);

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-3 text-center text-[15px] font-bold capitalize text-calma-ink">
        {title}
      </div>
      <div className="grid grid-cols-7 text-center text-[12px] text-calma-taupe">
        {weekdays.map((w) => (
          <div key={w} className="pb-2">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {monthGrid(month).map((day, i) => {
          if (!day) return <div key={`blank-${i}`} />;
          const iso = toISODate(day);
          const past = day < today;
          const isSelected = iso === selected;
          return (
            <button
              key={iso}
              type="button"
              disabled={past}
              onClick={() => onPick(iso)}
              aria-pressed={isSelected}
              aria-label={day.toLocaleDateString(locale, { dateStyle: "full" })}
              className={`mx-auto grid h-10 w-10 place-items-center rounded-full text-[14px] transition-colors ${
                past
                  ? "cursor-not-allowed text-calma-ink/25 line-through"
                  : isSelected
                    ? "bg-calma-ink font-semibold text-white"
                    : `text-calma-ink hover:bg-calma-ink/[.07] ${iso === todayISO ? "font-bold ring-1 ring-calma-ink/30" : ""}`
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DatePanel({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (iso: string | null) => void;
}) {
  const { t, lang } = useCalmaLang();
  const s = t.search;
  const locale = DATE_LOCALES[lang];
  const today = useMemo(() => startOfDay(new Date()), []);
  const thisMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);
  const [view, setView] = useState(() =>
    value
      ? new Date(fromISODate(value).getFullYear(), fromISODate(value).getMonth(), 1)
      : thisMonth,
  );

  const shortcuts = [
    { label: s.today, iso: toISODate(today) },
    { label: s.tomorrow, iso: toISODate(addDays(today, 1)) },
    { label: s.nextWeekend, iso: toISODate(nextWeekendSaturday(today)) },
  ];
  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
      active
        ? "bg-calma-ink text-white"
        : "bg-calma-ink/[.06] text-calma-ink hover:bg-calma-ink/[.1]"
    }`;

  return (
    <div className="p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap gap-2">
        {shortcuts.map((sc) => (
          <button
            key={sc.label}
            type="button"
            onClick={() => onChange(sc.iso)}
            className={chip(value === sc.iso)}
          >
            {sc.label}
          </button>
        ))}
        <button type="button" onClick={() => onChange(null)} className={chip(value === null)}>
          {s.dateFlexible}
        </button>
      </div>

      <div className="relative flex gap-8">
        <button
          type="button"
          aria-label={s.prevMonth}
          disabled={view <= thisMonth}
          onClick={() => setView((v) => addMonths(v, -1))}
          className="absolute start-0 top-0 grid h-8 w-8 place-items-center rounded-full text-calma-ink hover:bg-calma-ink/[.06] disabled:cursor-not-allowed disabled:text-calma-ink/20 disabled:hover:bg-transparent"
        >
          <ArrowLeft size={18} className="rtl:rotate-180" />
        </button>
        <button
          type="button"
          aria-label={s.nextMonth}
          onClick={() => setView((v) => addMonths(v, 1))}
          className="absolute end-0 top-0 grid h-8 w-8 place-items-center rounded-full text-calma-ink hover:bg-calma-ink/[.06]"
        >
          <ArrowRight size={18} className="rtl:rotate-180" />
        </button>
        <MonthView month={view} locale={locale} today={today} selected={value} onPick={onChange} />
        {/* Second month only where there's room for it. */}
        <div className="hidden min-w-0 flex-1 md:block">
          <MonthView
            month={addMonths(view, 1)}
            locale={locale}
            today={today}
            selected={value}
            onPick={onChange}
          />
        </div>
      </div>
    </div>
  );
}
