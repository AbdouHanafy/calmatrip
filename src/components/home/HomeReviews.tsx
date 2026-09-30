"use client";
import React from "react";
import { Star } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  service: string | null;
  createdAt: string;
}

const DATE_LOCALES = { fr: "fr-FR", en: "en-GB", ar: "ar-TN" } as const;

function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? "fill-calma-gold text-calma-gold" : "text-calma-ink/15"}
        />
      ))}
    </div>
  );
}

// Approved reviews from travellers who actually booked (see reviewRepository).
// Static grid, not a rotating carousel; hidden entirely until one exists.
export default function HomeReviews({ reviews }: { reviews: Review[] }) {
  const { t, lang } = useCalmaLang();
  if (reviews.length === 0) return null;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 className="m-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]">
          {t.home.reviewsHeading}
        </h2>
        <div className="flex items-center gap-2 text-[14px] text-calma-ink">
          <Stars rating={Math.round(avg)} size={17} />
          <span className="font-bold">{avg.toFixed(1)}/5</span>
          <span className="text-calma-taupe">
            · {t.home.reviewsCount.replace("{n}", String(reviews.length))}
          </span>
        </div>
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {reviews.slice(0, 3).map((r) => (
          <li key={r.id} className="rounded-xl border border-calma-ink/10 bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <Stars rating={r.rating} />
              <span className="text-[12.5px] text-calma-taupe">
                {new Date(r.createdAt).toLocaleDateString(DATE_LOCALES[lang], {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="m-0 line-clamp-5 text-[15px] leading-relaxed text-calma-ink">
              {r.comment}
            </p>
            <div className="mt-4 text-[14px] font-bold text-calma-ink">{r.name}</div>
            {r.service && <div className="text-[13px] text-calma-taupe">{r.service}</div>}
          </li>
        ))}
      </ul>
    </section>
  );
}
