"use client";
import React from "react";
import Image from "next/image";
import { useCalmaLang } from "@/lib/calma/i18n";

export default function CalmaTunisianStory() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-8 sm:px-10">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="relative h-[360px] w-full overflow-hidden rounded-calma-block sm:h-[460px] lg:h-[560px]">
          <Image
            src="/images/hero/color.png"
            alt="Contrastes tunisiens — mer, désert et médina"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <div className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-calma-terracotta">
            {t.storyKicker}
          </div>
          <h2 className="mb-7 font-fraunces text-[clamp(36px,5vw,58px)] font-normal italic leading-[1.08] tracking-[-0.01em] text-calma-ink">
            {t.storyHeading}
          </h2>
          <p className="max-w-[460px] text-pretty font-fraunces text-[19px] font-normal leading-[1.7] text-calma-taupe">
            {t.storyText}
          </p>
        </div>
      </div>
    </section>
  );
}
