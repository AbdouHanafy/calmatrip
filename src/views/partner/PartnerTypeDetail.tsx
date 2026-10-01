"use client";

import Link from "next/link";
import { Check, type LucideIcon } from "lucide-react";
import { CalmaLangProvider } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import PageHeader from "@/components/calma/PageHeader";

export interface PartnerBenefit {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface PartnerTypeDetailProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle: string;
  benefits: PartnerBenefit[];
  steps: string[];
  ctaHref: string;
  ctaLabel: string;
  otherHref: string;
  otherLabel: string;
  accent: string;
}

const wrap = "mx-auto max-w-[1000px] px-4 sm:px-6";
const h2 = "m-0 mb-5 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]";
const cta =
  "inline-flex items-center justify-center rounded-full bg-calma-ink px-7 py-3.5 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-calma-olive";

function PartnerTypeDetailContent({
  eyebrow,
  title,
  subtitle,
  benefits,
  steps,
  ctaHref,
  ctaLabel,
  otherHref,
  otherLabel,
  accent,
}: PartnerTypeDetailProps) {
  return (
    <>
      <CalmaHeader active="contact" />
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={title}
          subtitle={subtitle}
          image="/images/hero/sea.png"
          crumbs={[
            { label: "Accueil", href: "/" },
            { label: "Partenaires", href: "/partner" },
            { label: eyebrow },
          ]}
        >
          <div className="mt-5">
            <Link href={ctaHref} className={cta}>
              {ctaLabel}
            </Link>
          </div>
        </PageHeader>

        <section className={`${wrap} pt-10`}>
          <h2 className={h2}>Pourquoi rejoindre Calma Trip</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-xl border border-calma-ink/10 p-5">
                <b.icon size={24} strokeWidth={1.7} className="mb-3" style={{ color: accent }} />
                <h3 className="m-0 text-[16px] font-bold text-calma-ink">{b.title}</h3>
                <p className="mb-0 mt-1.5 text-[14.5px] leading-snug text-calma-taupe">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${wrap} pt-12`}>
          <h2 className={h2}>Comment ça marche</h2>
          <ol className="m-0 list-none space-y-4 p-0">
            {steps.map((step, i) => (
              <li key={step} className="flex items-start gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-calma-ink text-[14px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="m-0 mt-1.5 text-[15.5px] leading-relaxed text-calma-ink">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`${wrap} pt-12`}>
          <div className="rounded-2xl bg-calma-sand p-8 text-center sm:p-10">
            <div className="mb-5 inline-flex items-center gap-2 text-[14.5px] font-semibold text-calma-ink">
              <Check size={16} className="text-calma-success" />
              Inscription gratuite, soumise à validation
            </div>
            <div>
              <Link href={ctaHref} className={cta}>
                {ctaLabel}
              </Link>
            </div>
            <p className="mb-0 mt-5 text-[14.5px]">
              <Link
                href={otherHref}
                className="font-semibold text-calma-ink underline underline-offset-4"
              >
                {otherLabel}
              </Link>
            </p>
          </div>
        </section>
      </main>
      <CalmaFooter />
    </>
  );
}

export function PartnerTypeDetail(props: PartnerTypeDetailProps) {
  return (
    <CalmaLangProvider>
      <PartnerTypeDetailContent {...props} />
    </CalmaLangProvider>
  );
}
