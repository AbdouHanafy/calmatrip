"use client";
import React from "react";
import Link from "next/link";
import {
  Building2,
  Bus,
  CalendarDays,
  Coffee,
  Landmark,
  MapPinned,
  Mountain,
  type LucideIcon,
} from "lucide-react";
import { useCalmaLang, type CalmaHomeDict } from "@/lib/calma/i18n";

// Explore links use the real category ids from lib/explore/places.ts
// (CATEGORY_IDS) so each chip lands on a filtered, non-empty list.
const CHIPS: { key: keyof CalmaHomeDict["chips"]; href: string; icon: LucideIcon }[] = [
  { key: "tours", href: "/services", icon: Bus },
  { key: "sights", href: "/explore?category=Sight", icon: Landmark },
  { key: "activities", href: "/explore?category=Activity", icon: Mountain },
  { key: "food", href: `/explore?category=${encodeURIComponent("Food & Drink")}`, icon: Coffee },
  {
    key: "hiddenGems",
    href: `/explore?category=${encodeURIComponent("Hidden Gem")}`,
    icon: MapPinned,
  },
  { key: "museums", href: "/explore?category=Museum", icon: Building2 },
  { key: "events", href: "/explore?category=Event", icon: CalendarDays },
];

export default function HomeCategoryChips() {
  const { t } = useCalmaLang();

  return (
    <nav
      aria-label={t.home.chipsLabel}
      className="mx-auto max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-8"
    >
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 calma-scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {CHIPS.map(({ key, href, icon: Icon }) => (
          <li key={key} className="shrink-0">
            <Link
              href={href}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-calma-ink/15 bg-white px-3.5 py-2.5 text-[14px] font-semibold text-calma-ink no-underline transition-colors hover:border-calma-ink/45 hover:bg-calma-sand/40"
            >
              <Icon size={17} strokeWidth={1.8} />
              {t.home.chips[key]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
