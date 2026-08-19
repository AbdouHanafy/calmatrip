"use client";

import Link from "next/link";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import { CalmaLangProvider } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";

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

function PartnerTypeDetailContent({
  icon: Icon,
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
      <main className="min-h-screen bg-calma-cream font-hanken">
        {/* Hero */}
        <section className="bg-calma-olive px-6 pb-16 pt-20 text-center sm:px-10">
          <div className="mx-auto max-w-[640px]">
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/[.08] backdrop-blur-md"
              style={{ color: accent }}
            >
              <Icon size={26} />
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
              {eyebrow}
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(30px,4vw,44px)] font-normal leading-[1.1] tracking-[-0.02em] text-calma-cream">
              {title}
            </h1>
            <p className="mx-auto mb-8 max-w-[520px] text-pretty text-[16px] leading-[1.65] text-white/80">
              {subtitle}
            </p>
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-calma-cream no-underline shadow-[0_16px_32px_-12px_rgba(242,153,74,.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_-12px_rgba(242,153,74,.8)]"
              style={{ background: "linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)" }}
            >
              {ctaLabel}
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>

        {/* Benefits */}
        <section className="mx-auto max-w-[1000px] px-6 py-16 sm:px-10">
          <h2 className="mb-10 text-center font-fraunces text-[clamp(24px,3vw,32px)] font-normal text-calma-ink">
            Pourquoi rejoindre Calma Trip
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-calma-block border border-calma-olive/10 bg-white p-6"
                style={{ boxShadow: "0 14px 36px -24px rgba(42,38,34,.3)" }}
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: `${accent}18`, color: accent }}
                >
                  <b.icon size={20} />
                </div>
                <h3 className="mb-1.5 font-fraunces text-lg font-normal text-calma-ink">
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-calma-taupe">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-[800px]">
            <h2 className="mb-10 text-center font-fraunces text-[clamp(24px,3vw,32px)] font-normal text-calma-ink">
              Comment ça marche
            </h2>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={step} className="flex items-start gap-4">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: accent }}
                  >
                    {i + 1}
                  </div>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-calma-ink">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-[720px] px-6 py-16 text-center sm:px-10">
          <div
            className="rounded-calma-block border border-calma-olive/10 bg-calma-sand p-10"
            style={{ boxShadow: "0 22px 50px -22px rgba(42,38,34,.25)" }}
          >
            <div className="mb-4 flex justify-center gap-1.5 text-calma-success">
              <Check size={16} />
              <span className="text-sm font-medium text-calma-ink">
                Inscription gratuite, soumise à validation
              </span>
            </div>
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold text-calma-cream no-underline shadow-[0_16px_32px_-12px_rgba(242,153,74,.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_-12px_rgba(242,153,74,.8)]"
              style={{ background: "linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)" }}
            >
              {ctaLabel}
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <p className="mt-5 text-sm text-calma-taupe">
              <Link
                href={otherHref}
                className="font-semibold text-calma-terracotta no-underline hover:text-calma-olive"
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
