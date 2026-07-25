'use client';
import React from 'react';
import Link from 'next/link';
import { useCalmaLang } from '@/lib/calma/i18n';

export default function CalmaFinalCTA() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto mb-8 mt-28 max-w-[1240px] px-6">
      <div className="relative overflow-hidden rounded-calma-block bg-calma-olive p-[72px_clamp(28px,6vw,72px)] text-center text-calma-cream">
        <div
          className="pointer-events-none absolute -right-1/4 -top-1/3 h-[520px] w-[520px] rounded-full opacity-20 blur-[90px]"
          style={{ background: 'radial-gradient(circle, #F2994A 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-[420px] w-[420px] rounded-full opacity-[.12] blur-[90px]"
          style={{ background: 'radial-gradient(circle, #F1EBE1 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[640px]">
          <div className="mb-4 inline-flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[.18em] text-calma-terracotta-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta-soft" />
            {t.newsKicker}
          </div>
          <h2 className="mb-4 text-balance font-fraunces text-[clamp(32px,4.4vw,54px)] font-normal leading-[1.02] tracking-[-0.02em]">
            {t.newsTitle}
          </h2>
          <p className="mx-auto mb-[30px] max-w-[520px] text-pretty text-[16.5px] leading-[1.6] text-calma-cream/[.82]">
            {t.newsSub}
          </p>
          <div className="mb-[26px] flex flex-wrap justify-center gap-3">
            <Link
              href="/services"
              className="rounded-full bg-calma-cream px-[30px] py-[15px] font-hanken text-[15px] font-semibold text-calma-olive no-underline shadow-[0_10px_24px_-10px_rgba(0,0,0,.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,.5)]"
            >
              {t.newsBtn1}
            </Link>
            <a
              href="tel:+21621622972"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-[30px] py-[15px] font-hanken text-[15px] font-semibold text-calma-cream no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/[.08]"
            >
              ☏ {t.newsBtn2}
            </a>
          </div>
          <div className="text-[13px] font-semibold tracking-[.04em] text-calma-cream/70">{t.newsTrust}</div>
        </div>
      </div>
    </section>
  );
}
