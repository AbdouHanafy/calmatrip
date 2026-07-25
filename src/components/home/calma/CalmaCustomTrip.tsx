'use client';
import React from 'react';
import Image from 'next/image';
import { CheckCircle2, Quote } from 'lucide-react';
import { useCalmaLang } from '@/lib/calma/i18n';

export default function CalmaCustomTrip() {
  const { t } = useCalmaLang();
  const checklist = t.whys.slice(0, 3);
  const quote = t.testis[0];

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-8 sm:px-10">
      <div className="grid grid-cols-1 items-center gap-14 rounded-calma-block bg-white p-8 shadow-[0_2px_24px_-12px_rgba(20,15,10,.12)] sm:p-12 lg:grid-cols-[1fr_1fr]">
        {/* Text + checklist */}
        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-calma-terracotta">
            {t.customKicker}
          </div>
          <h2 className="mb-5 font-fraunces text-[clamp(28px,3.4vw,40px)] font-normal leading-[1.1] tracking-[-0.02em] text-calma-ink">
            {t.customHeading}
          </h2>
          <p className="mb-8 max-w-[440px] text-base leading-[1.65] text-calma-taupe">{t.customSub}</p>

          <div className="flex flex-col gap-4">
            {checklist.map((item) => (
              <div key={item.n} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0 text-calma-terracotta" strokeWidth={1.75} />
                <span className="text-[14.5px] font-semibold text-calma-ink">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Photo + testimonial overlay */}
        <div className="relative mx-auto h-[340px] w-full max-w-[480px] sm:h-[400px]">
          <div className="absolute inset-0 overflow-hidden rounded-calma-block shadow-[0_30px_60px_-24px_rgba(20,15,10,.35)]">
            <Image
              src="/images/explore/chebika_oasis.png"
              alt="Oasis de Chebika, Tunisie"
              fill
              sizes="(min-width: 1024px) 460px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 right-4 max-w-[260px] rounded-2xl bg-calma-terracotta p-5 text-calma-cream shadow-[0_20px_40px_-16px_rgba(20,15,10,.5)] sm:right-6">
            <Quote size={18} className="mb-2 text-calma-cream/70" />
            <p className="m-0 font-fraunces text-[14.5px] italic leading-[1.5]">&ldquo;{quote.quote}&rdquo;</p>
            <p className="mt-2.5 text-[11.5px] font-semibold uppercase tracking-[.06em] text-calma-cream/70">
              {quote.name} · {quote.role}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
