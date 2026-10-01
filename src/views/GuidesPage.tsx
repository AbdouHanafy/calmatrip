"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import PageHeader from "@/components/calma/PageHeader";

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
      <CalmaHeader active="blog" />
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={t.guidesHeroTitle}
          subtitle={t.guidesHeroSub}
          image="/images/explore/kairouan_mosque.png"
          imageAlt="Guides pratiques Tunisie"
          crumbs={[{ label: t.cnt.breadcrumbHome, href: "/" }, { label: t.guidesEyebrow }]}
        />

        <section className="mx-auto max-w-[1240px] px-4 pt-8 sm:px-6 lg:px-8">
          {guides.length === 0 ? (
            <div className="py-20 text-center">
              <BookOpen size={40} strokeWidth={1.4} className="mx-auto mb-3 text-calma-ink/30" />
              <p className="m-0 text-[15px] text-calma-taupe">{t.guidesEmpty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {guides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="group block no-underline"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-calma-sand">
                    {guide.image ? (
                      <Image
                        src={guide.image}
                        alt={guide.title}
                        fill
                        sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 90vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-calma-ink/35">
                        <BookOpen size={40} strokeWidth={1.4} />
                      </div>
                    )}
                  </div>
                  <div className="pt-3">
                    {guide.category && (
                      <div className="mb-1 text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
                        {guide.category}
                      </div>
                    )}
                    <h3 className="m-0 line-clamp-2 text-[16px] font-bold leading-snug text-calma-ink group-hover:underline">
                      {guide.title}
                    </h3>
                    <p className="mb-0 mt-1.5 line-clamp-3 text-[13.5px] leading-snug text-calma-taupe">
                      {guide.summary}
                    </p>
                    <span className="mt-2 inline-block text-[14px] font-semibold text-calma-ink underline underline-offset-4">
                      {t.guidesRead}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
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
