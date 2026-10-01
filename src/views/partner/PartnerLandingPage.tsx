"use client";

import Link from "next/link";
import { Store, Compass, Check } from "lucide-react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import PageHeader from "@/components/calma/PageHeader";

function PartnerLandingContent() {
  const { t } = useCalmaLang();

  const profiles = [
    {
      href: "/partner/artisan",
      icon: Store,
      accent: "#5E8B63",
      label: t.pln.artisanLabel,
      desc: t.pln.artisanDesc,
      points: t.pln.artisanPoints,
    },
    {
      href: "/partner/agency",
      icon: Compass,
      accent: "#4C7A92",
      label: t.pln.agencyLabel,
      desc: t.pln.agencyDesc,
      points: t.pln.agencyPoints,
    },
  ];

  return (
    <>
      <CalmaHeader active="contact" />
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={t.pln.heroTitle}
          subtitle={t.pln.heroSub}
          image="/images/hero/sea.png"
          crumbs={[{ label: t.cnt.breadcrumbHome, href: "/" }, { label: t.pln.eyebrow }]}
        />

        <section className="mx-auto max-w-[1000px] px-4 pt-8 sm:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {profiles.map((p) => (
              <div
                key={p.href}
                className="flex flex-col rounded-2xl border border-calma-ink/10 p-6 sm:p-7"
              >
                <p.icon size={28} strokeWidth={1.6} className="mb-4" style={{ color: p.accent }} />
                <h2 className="m-0 mb-2 text-[22px] font-bold text-calma-ink">{p.label}</h2>
                <p className="mb-5 mt-0 text-[15px] leading-relaxed text-calma-taupe">{p.desc}</p>
                <ul className="m-0 mb-7 list-none space-y-2.5 p-0">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-[14.5px] text-calma-ink">
                      <Check size={16} className="mt-0.5 shrink-0 text-calma-olive" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-calma-olive"
                >
                  {t.pln.learnMore}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <CalmaFooter />
    </>
  );
}

export default function PartnerLandingPage() {
  return (
    <CalmaLangProvider>
      <PartnerLandingContent />
    </CalmaLangProvider>
  );
}
