"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

const IMAGES = [
  "/images/explore/chebika_oasis.png",
  "/images/explore/sahara_camel.png",
  encodeURI("/images/explore/El Jem Amphitheatre.jpg"),
];
const EXTRA = [
  { duration: "3h", category: "Culture" },
  { duration: "4h", category: "Désert" },
  { duration: "2h", category: "Culture" },
];
const FALLBACK_IMAGE = "/images/explore/carthage_ports.png";

export interface FeaturedExperience {
  id: number;
  title: string;
  city: string;
  category: string;
  image: string | null;
  duration: string | null;
  openingHours: string | null;
  price: string | null;
}

// Pulls the leading number out of a free-text price ("60 TND" -> 60); returns null if not parseable.
function parsePrice(price: string | null): number | null {
  if (!price) return null;
  const match = price.match(/[\d.]+/);
  if (!match) return null;
  const n = parseFloat(match[0]);
  return isNaN(n) ? null : n;
}

export default function CalmaMarketplacePreview({
  experiences = [],
}: {
  experiences?: FeaturedExperience[];
}) {
  const { t } = useCalmaLang();
  const items = experiences.slice(0, 3);

  if (items.length > 0) {
    return (
      <section className="mx-auto max-w-[1240px] px-6 pb-8 pt-24 sm:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-calma-terracotta">
              {t.expKicker}
            </div>
            <h2 className="m-0 font-fraunces text-[clamp(30px,3.6vw,44px)] font-normal tracking-[-0.02em] text-calma-ink">
              {t.expHeading}
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-[14.5px] font-semibold text-calma-terracotta no-underline transition-colors hover:text-calma-olive"
          >
            {t.expViewAll} →
          </Link>
        </div>

        <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 calma-scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {items.map((exp) => {
            const numericPrice = parsePrice(exp.price);
            const duration = exp.duration ?? exp.openingHours;
            return (
              <Link
                key={exp.id}
                href="/explore"
                className="group block w-[80%] shrink-0 snap-start overflow-hidden rounded-[26px] border border-calma-olive/[.1] bg-calma-cream no-underline shadow-[0_8px_24px_-16px_rgba(42,38,34,.3)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_36px_64px_-28px_rgba(42,38,34,.45)] sm:w-auto sm:shrink sm:snap-none"
              >
                <div className="relative h-[260px] overflow-hidden bg-calma-olive-deep">
                  <Image
                    src={exp.image || FALLBACK_IMAGE}
                    alt={exp.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute left-3.5 top-3.5 rounded-full border border-white/25 bg-black/25 px-3 py-[6px] text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                    {exp.category}
                  </div>
                  {duration && (
                    <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3 py-[6px] text-[11px] font-semibold text-white backdrop-blur-md">
                      <Clock size={12} />
                      {duration}
                    </div>
                  )}
                </div>
                <div className="p-[22px] pb-6">
                  <div className="mb-2 text-[12.5px] font-semibold text-calma-terracotta">
                    ◦ {exp.city}
                  </div>
                  <h3 className="mb-4 min-h-[46px] font-fraunces text-[19px] font-normal leading-[1.25] text-calma-ink">
                    {exp.title}
                  </h3>
                  <div className="flex items-baseline justify-between border-t border-calma-olive/[.12] pt-4">
                    <div>
                      {numericPrice !== null ? (
                        <>
                          <span className="text-xs text-calma-taupe">{t.expFrom} </span>
                          <span className="font-fraunces text-[24px] font-semibold text-calma-olive">
                            {numericPrice} TND
                          </span>
                          <span className="text-xs text-calma-taupe"> {t.expPer}</span>
                        </>
                      ) : (
                        <span className="font-fraunces text-[20px] font-semibold text-calma-olive">
                          {exp.price ?? "Sur devis"}
                        </span>
                      )}
                    </div>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-calma-terracotta/10 text-lg text-calma-terracotta transition-colors group-hover:bg-calma-terracotta group-hover:text-white">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-8 pt-24 sm:px-10">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-calma-terracotta">
            {t.expKicker}
          </div>
          <h2 className="m-0 font-fraunces text-[clamp(30px,3.6vw,44px)] font-normal tracking-[-0.02em] text-calma-ink">
            {t.expHeading}
          </h2>
        </div>
        <Link
          href="/explore"
          className="text-[14.5px] font-semibold text-calma-terracotta no-underline transition-colors hover:text-calma-olive"
        >
          {t.expViewAll} →
        </Link>
      </div>

      <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 calma-scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
        {t.exps.map((exp, i) => (
          <Link
            key={exp.title}
            href="/explore"
            className="group block w-[80%] shrink-0 snap-start overflow-hidden rounded-[26px] border border-calma-olive/[.1] bg-calma-cream no-underline shadow-[0_8px_24px_-16px_rgba(42,38,34,.3)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_36px_64px_-28px_rgba(42,38,34,.45)] sm:w-auto sm:shrink sm:snap-none"
          >
            <div className="relative h-[260px] overflow-hidden bg-calma-olive-deep">
              <Image
                src={IMAGES[i]}
                alt={exp.title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute left-3.5 top-3.5 rounded-full border border-white/25 bg-black/25 px-3 py-[6px] text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                {EXTRA[i].category}
              </div>
              <div className="absolute right-3.5 top-3.5 rounded-full bg-calma-cream px-2.5 py-[5px] text-xs font-bold text-calma-olive shadow-sm">
                <span className="text-calma-gold">★</span> {exp.rating}
              </div>
              <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3 py-[6px] text-[11px] font-semibold text-white backdrop-blur-md">
                <Clock size={12} />
                {EXTRA[i].duration}
              </div>
            </div>
            <div className="p-[22px] pb-6">
              <div className="mb-2 text-[12.5px] font-semibold text-calma-terracotta">
                ◦ {exp.place}
              </div>
              <h3 className="mb-4 min-h-[46px] font-fraunces text-[19px] font-normal leading-[1.25] text-calma-ink">
                {exp.title}
              </h3>
              <div className="flex items-baseline justify-between border-t border-calma-olive/[.12] pt-4">
                <div>
                  <span className="text-xs text-calma-taupe">{t.expFrom} </span>
                  <span className="font-fraunces text-[24px] font-semibold text-calma-olive">
                    {exp.price} TND
                  </span>
                  <span className="text-xs text-calma-taupe"> {t.expPer}</span>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-calma-terracotta/10 text-lg text-calma-terracotta transition-colors group-hover:bg-calma-terracotta group-hover:text-white">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
