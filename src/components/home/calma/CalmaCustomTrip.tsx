"use client";
import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

interface RealReview {
  name: string;
  comment: string;
  service: string | null;
}

export default function CalmaCustomTrip({ review }: { review?: RealReview | null }) {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-8 sm:px-10">
      <div className="grid grid-cols-1 items-center gap-14 rounded-calma-block bg-white p-8 shadow-[0_2px_24px_-12px_rgba(20,15,10,.12)] sm:p-12 lg:grid-cols-[1fr_1fr]">
        {/* Text */}
        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-calma-terracotta">
            {t.customKicker}
          </div>
          <h2 className="mb-5 font-fraunces text-[clamp(28px,3.4vw,40px)] font-normal leading-[1.1] tracking-[-0.02em] text-calma-ink">
            {t.customHeading}
          </h2>
          <p className="max-w-[440px] text-base leading-[1.65] text-calma-taupe">{t.customSub}</p>
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
          {/* Real client quote only — omitted entirely until an actual review exists,
              never a stand-in name/quote. */}
          {review && (
            <div className="absolute -bottom-6 right-4 max-w-[260px] rounded-2xl bg-calma-terracotta p-5 text-calma-ink shadow-[0_20px_40px_-16px_rgba(20,15,10,.5)] sm:right-6">
              <Quote size={18} className="mb-2 text-calma-ink/60" />
              <p className="m-0 line-clamp-3 font-fraunces text-[14.5px] italic leading-[1.5]">
                &ldquo;{review.comment}&rdquo;
              </p>
              <p className="mt-2.5 text-[11.5px] font-semibold uppercase tracking-[.06em] text-calma-ink/70">
                {review.name}
                {review.service ? ` · ${review.service}` : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
