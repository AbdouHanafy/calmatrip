"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";

interface Guide {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string | null;
  icon: string | null;
  image: string | null;
}

function GuidesPageContent({ guides }: { guides: Guide[] }) {
  const { t } = useCalmaLang();

  return (
    <>
      <CalmaHeader active="explore" />
      <div className="min-h-screen bg-calma-sand font-hanken">
        <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden px-6 py-16 text-center sm:px-10">
          <Image
            src="/images/explore/kairouan_mosque.png"
            alt="Guides pratiques Tunisie"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(42,38,34,.72) 0%,rgba(42,38,34,.6) 45%,rgba(42,38,34,.8) 100%)",
            }}
          />
          <div className="relative z-[2] mx-auto max-w-[640px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta" />
              {t.guidesEyebrow}
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(32px,4.4vw,48px)] font-normal leading-[1.05] tracking-[-0.02em] text-calma-cream">
              {t.guidesHeroTitle}
            </h1>
            <p className="mx-auto max-w-[520px] text-pretty text-[16px] leading-[1.65] text-white/80">
              {t.guidesHeroSub}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
          {guides.length === 0 ? (
            <div className="py-24 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-calma-taupe/30" />
              <p className="font-medium text-calma-taupe">{t.guidesEmpty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-calma-olive/[.1] bg-white no-underline shadow-[0_8px_24px_-16px_rgba(42,38,34,.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-24px_rgba(42,38,34,.4)]"
                >
                  {guide.image ? (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={guide.image}
                        alt={guide.title}
                        fill
                        sizes="400px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-calma-olive/[.06]">
                      <BookOpen className="h-9 w-9 text-calma-olive/40" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {guide.category && (
                      <span className="mb-2 self-start rounded-full bg-calma-terracotta/10 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-calma-terracotta">
                        {guide.category}
                      </span>
                    )}
                    <h3 className="mb-2 font-fraunces text-lg font-normal text-calma-ink">
                      {guide.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-calma-taupe line-clamp-3">
                      {guide.summary}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-calma-terracotta">
                      {t.guidesRead}{" "}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
      <CalmaFooter />
    </>
  );
}

export default function GuidesPage({ guides }: { guides: Guide[] }) {
  return (
    <CalmaLangProvider>
      <GuidesPageContent guides={guides} />
    </CalmaLangProvider>
  );
}
