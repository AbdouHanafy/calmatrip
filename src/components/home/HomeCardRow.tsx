"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

// Section heading + horizontally scrollable row of cards. Swipe on touch,
// arrow buttons on desktop — never auto-advances.
export default function HomeCardRow({
  title,
  seeAllHref,
  children,
}: {
  title: string;
  seeAllHref?: string;
  children: React.ReactNode;
}) {
  const { t, dir } = useCalmaLang();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // In RTL, scrollLeft runs negative, so "next" moves left.
    const sign = dir === "rtl" ? -1 : 1;
    el.scrollBy({ left: direction * sign * el.clientWidth * 0.9, behavior: "smooth" });
  };

  const arrowClass =
    "grid h-9 w-9 place-items-center rounded-full border border-calma-ink/15 bg-white text-calma-ink transition-colors hover:border-calma-ink/40";

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="m-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]">
          {title}
        </h2>
        <div className="flex shrink-0 items-center gap-3">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-[14px] font-semibold text-calma-ink underline-offset-4 hover:underline"
            >
              {t.home.seeAll}
            </Link>
          )}
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              aria-label={t.home.prev}
              onClick={() => scroll(-1)}
              className={arrowClass}
            >
              <ChevronLeft size={18} className="rtl:rotate-180" />
            </button>
            <button
              type="button"
              aria-label={t.home.next}
              onClick={() => scroll(1)}
              className={arrowClass}
            >
              <ChevronRight size={18} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 calma-scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:gap-5 lg:px-0"
      >
        {React.Children.map(children, (child) => (
          <div className="w-[72%] shrink-0 snap-start sm:w-[44%] md:w-[31%] lg:w-[calc((100%-60px)/4)]">
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}
