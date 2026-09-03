"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCalmaLang } from "@/lib/calma/i18n";

export default function CalmaWhyBanner() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto mt-28 max-w-[1240px] px-6">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1fr]">
        {/* Layered photo collage */}
        <div className="relative mx-auto h-[420px] w-full max-w-[460px] lg:h-[460px]">
          <div className="absolute left-0 top-0 h-[85%] w-[82%] overflow-hidden rounded-calma-block shadow-[0_30px_60px_-24px_rgba(20,15,10,.4)]">
            <Image
              src="/images/explore/sahara_camel.png"
              alt="Caravane dans le désert tunisien"
              fill
              sizes="(min-width: 1024px) 380px, 80vw"
              className="object-cover"
            />
          </div>
          <div className="absolute left-4 top-4 rounded-2xl bg-calma-olive px-4 py-3 text-calma-cream shadow-[0_16px_30px_-12px_rgba(20,15,10,.5)]">
            <div className="font-fraunces text-2xl leading-none">500+</div>
            <div className="mt-1 text-[11px] font-semibold uppercase tracking-[.08em] text-calma-cream/75">
              Voyages réussis
            </div>
          </div>
          <div className="absolute bottom-0 right-0 h-[62%] w-[52%] overflow-hidden rounded-calma-card border-4 border-white shadow-[0_24px_50px_-16px_rgba(20,15,10,.45)]">
            <Image
              src="/images/explore/sidi_bou_said.png"
              alt="Ruelle de Sidi Bou Saïd"
              fill
              sizes="(min-width: 1024px) 220px, 45vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Text + stats + CTA */}
        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-calma-terracotta">
            {t.whyKicker}
          </div>
          <h2 className="mb-5 font-fraunces text-[clamp(32px,4vw,46px)] font-normal leading-[1.06] tracking-[-0.02em] text-calma-ink">
            {t.whyHeading}
          </h2>
          <p className="mb-8 max-w-[440px] text-base leading-[1.65] text-calma-taupe">{t.whySub}</p>

          <div className="mb-9 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {t.whys.map((why) => (
              <div key={why.n} className="flex items-start gap-4">
                <span className="font-fraunces text-[26px] font-normal leading-none text-calma-terracotta">
                  {why.n}
                </span>
                <div>
                  <div className="mb-1 text-[14.5px] font-semibold text-calma-ink">{why.title}</div>
                  <div className="text-[13px] leading-[1.5] text-calma-taupe">{why.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="group inline-flex items-center gap-2 rounded-full bg-calma-terracotta px-6 py-3.5 font-hanken text-[14.5px] font-semibold text-calma-ink no-underline shadow-[0_10px_24px_-8px_rgba(210,179,139,.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(210,179,139,.75)]"
          >
            {t.whyBtn}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
