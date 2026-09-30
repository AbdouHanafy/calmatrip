"use client";
import React from "react";
import Image from "next/image";
import { useCalmaLang } from "@/lib/calma/i18n";
import SearchBar from "@/components/search/SearchBar";
import type { SearchOptions } from "@/lib/searchOptions";

// One real photo, one headline, one search bar. No slideshow, no parallax.
// The bar sits in normal flow under the photo: on phones it overlaps the photo's
// bottom edge like a card (it's too tall to fit on it), on desktop it's pulled
// up onto the photo. Only the photo clips, so the bar's panels can hang below.
export default function HomeHero({ searchOptions }: { searchOptions: SearchOptions }) {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <div className="relative h-[360px] overflow-hidden rounded-2xl sm:h-[400px] lg:h-[500px]">
        <Image
          src="/images/hero/color.png"
          alt={t.home.heroCaption}
          fill
          priority
          sizes="(min-width: 1240px) 1240px, 100vw"
          className="object-cover object-[center_60%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/0" />
        {/* Extra shade behind the text column — the facades are bright and busy. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-black/0 rtl:bg-gradient-to-l" />
        <span className="absolute end-3 top-3 rounded bg-black/45 px-2 py-1 text-[11px] font-medium text-white/90">
          {t.home.heroCaption}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-5 pb-12 sm:p-8 sm:pb-14 lg:p-10 lg:pb-[132px]">
          <h1 className="m-0 max-w-[640px] text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[44px] lg:text-[52px]">
            {t.home.heroTitle}
          </h1>
          <p className="mb-0 mt-3 max-w-[520px] text-[15px] font-medium leading-relaxed text-white sm:text-[17px]">
            {t.home.heroSub}
          </p>
        </div>
      </div>

      <div className="relative z-20 -mt-8 px-2 sm:px-6 lg:-mt-[112px] lg:px-10 lg:pb-11">
        <SearchBar variant="hero" options={searchOptions} />
      </div>
    </section>
  );
}
