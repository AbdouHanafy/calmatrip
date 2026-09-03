"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCalmaLang } from "@/lib/calma/i18n";

// Curated editorial content, not a bookable "Journey" entity — no such model
// exists (or should exist) in the data layer. Each card links to a real
// route (/explore) so the CTA is never a dead end.
const IMAGES = [
  "/images/explore/sahara_camel.png",
  "/images/hero/sea1.png",
  encodeURI("/images/explore/El Jem Amphitheatre.jpg"),
];

export default function CalmaFeaturedJourneys() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-8 pt-24 sm:px-10">
      <div className="mb-12 max-w-[560px]">
        <div className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-calma-terracotta">
          {t.journeysKicker}
        </div>
        <h2 className="mb-3 font-fraunces text-[clamp(30px,3.6vw,44px)] font-normal tracking-[-0.02em] text-calma-ink">
          {t.journeysHeading}
        </h2>
        <p className="m-0 text-[15.5px] leading-[1.55] text-calma-taupe">{t.journeysSub}</p>
      </div>

      <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 calma-scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
        {t.journeys.map((journey, i) => (
          <Link
            key={journey.title}
            href="/explore"
            className="group block w-[82%] shrink-0 snap-start overflow-hidden rounded-[26px] no-underline sm:w-auto sm:shrink"
          >
            <div className="relative h-[320px] overflow-hidden rounded-[26px]">
              <Image
                src={IMAGES[i]}
                alt={journey.title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(21,36,46,.85), rgba(21,36,46,0) 55%)",
                }}
              />
              <div className="absolute left-5 right-5 top-5 text-[11px] font-bold uppercase tracking-[.1em] text-calma-terracotta-soft">
                {journey.region} · {journey.duration}
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="mb-2 font-fraunces text-[22px] font-normal italic leading-[1.2] text-white">
                  {journey.title}
                </h3>
                <p className="m-0 text-[13px] leading-[1.5] text-white/[.82]">{journey.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
