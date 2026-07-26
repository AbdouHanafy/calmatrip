"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";

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
        <CalmaHeader active="explore" />
        <div className="min-h-screen bg-calma-sand" />
        <CalmaFooter />
      </>
    );
  }

  if (!guide) {
    return (
      <>
        <CalmaHeader active="explore" />
        <div className="flex min-h-[70vh] flex-col items-center justify-center bg-calma-sand px-6 text-center">
          <BookOpen className="mb-4 h-12 w-12 text-calma-taupe/30" />
          <h1 className="mb-2 font-fraunces text-2xl text-calma-ink">Guide introuvable</h1>
          <Link
            href="/guides"
            className="text-sm font-semibold text-calma-terracotta no-underline hover:text-calma-olive"
          >
            ← {t.guidesBack}
          </Link>
        </div>
        <CalmaFooter />
      </>
    );
  }

  return (
    <>
      <CalmaHeader active="explore" />
      <div className="min-h-screen bg-calma-sand font-hanken">
        <section className="relative flex min-h-[260px] items-center justify-center overflow-hidden px-6 py-16 text-center sm:px-10">
          {guide.image ? (
            <Image
              src={guide.image}
              alt={guide.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-calma-olive" />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(42,38,34,.72) 0%,rgba(42,38,34,.6) 45%,rgba(42,38,34,.8) 100%)",
            }}
          />
          <div className="relative z-[2] mx-auto max-w-[640px]">
            {guide.category && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta" />
                {guide.category}
              </div>
            )}
            <h1 className="text-balance font-fraunces text-[clamp(28px,4vw,42px)] font-normal leading-[1.1] tracking-[-0.02em] text-calma-cream">
              {guide.title}
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-14 lg:px-0">
          <Link
            href="/guides"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-calma-terracotta no-underline hover:text-calma-olive"
          >
            <ArrowLeft className="h-4 w-4" /> {t.guidesBack}
          </Link>

          <div className="rounded-3xl border border-calma-olive/[.1] bg-white p-8 sm:p-10">
            <p className="mb-6 text-[15px] leading-relaxed text-calma-taupe">{guide.summary}</p>
            <div
              className="prose max-w-none text-[15px] leading-relaxed text-calma-ink [&_h2]:font-fraunces [&_h2]:text-xl [&_h2]:font-normal [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:font-fraunces [&_h3]:text-lg [&_h3]:font-normal [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_a]:text-calma-terracotta [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: guide.content }}
            />
          </div>
        </section>
      </div>
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
