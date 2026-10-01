"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  content: string;
  category: string | null;
  image: string | null;
}

function GuideDetailContent() {
  const { t } = useCalmaLang();
  const params = useParams();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : "";

  const [guide, setGuide] = useState<Guide | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/guides/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setGuide(data))
      .catch(() => setGuide(null));
  }, [slug]);

  if (guide === undefined) {
    return (
      <>
        <CalmaHeader active="blog" />
        <div className="min-h-screen bg-white" />
        <CalmaFooter />
      </>
    );
  }

  if (!guide) {
    return (
      <>
        <CalmaHeader active="blog" />
        <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-6 text-center font-hanken">
          <BookOpen size={40} strokeWidth={1.4} className="mb-3 text-calma-ink/30" />
          <h1 className="m-0 mb-4 text-[22px] font-bold text-calma-ink">Guide introuvable</h1>
          <Link
            href="/guides"
            className="rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline hover:bg-calma-olive"
          >
            {t.guidesBack}
          </Link>
        </div>
        <CalmaFooter />
      </>
    );
  }

  return (
    <>
      <CalmaHeader active="blog" />
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={guide.title}
          subtitle={guide.summary}
          crumbs={[
            { label: t.cnt.breadcrumbHome, href: "/" },
            { label: t.guidesEyebrow, href: "/guides" },
            { label: guide.title },
          ]}
        />

        <article className="mx-auto max-w-[760px] px-4 sm:px-6">
          {guide.image && (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-calma-sand">
              <Image
                src={guide.image}
                alt={guide.title}
                fill
                sizes="(min-width: 800px) 760px, 100vw"
                className="object-cover"
              />
            </div>
          )}
          {guide.category && (
            <div className="mb-3 text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
              {guide.category}
            </div>
          )}
          <div
            className="text-[16px] leading-[1.75] text-calma-ink [&_a]:text-calma-olive [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-[22px] [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-[18px] [&_h3]:font-bold [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:ps-5 [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ps-5"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
        </article>
      </main>
      <CalmaFooter />
    </>
  );
}

export default function GuideDetailPage() {
  return (
    <CalmaLangProvider>
      <GuideDetailContent />
    </CalmaLangProvider>
  );
}
