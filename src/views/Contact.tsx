"use client";
import Link from "next/link";
import Image from "next/image";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import { ContactInfoCards } from "@/components/contact/ContactInfoCards";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactSidebar } from "@/components/contact/ContactSidebar";
import { ContactFaqSection } from "@/components/contact/ContactFaqSection";
import { ContactCta } from "@/components/contact/ContactCta";

interface FaqItem {
  q: string;
  a: string;
}

function ContactContent({ faqs }: { faqs: FaqItem[] }) {
  const { t } = useCalmaLang();

  return (
    <>
      <CalmaHeader active="contact" />
      <div className="min-h-screen bg-[#F1EBE1]">
        {/* ── Hero — cinematic, photo-backed, breadcrumb + welcoming intro ── */}
        <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden px-6 py-20 text-center sm:px-10">
          <Image
            src="/images/explore/chebika_oasis.png"
            alt="Chebika, Tunisie"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(42,38,34,.72) 0%,rgba(42,38,34,.55) 45%,rgba(42,38,34,.82) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(100deg,transparent 0 26px,#F8F5F0 26px 27px)",
            }}
          />
          <div className="relative z-[2] mx-auto max-w-[640px]">
            {/* Breadcrumb */}
            <nav
              aria-label="Fil d'Ariane"
              className="mb-6 flex items-center justify-center gap-2 text-[12.5px] font-medium text-white/60"
            >
              <Link href="/" className="transition-colors hover:text-white">
                {t.cnt.breadcrumbHome}
              </Link>
              <span>/</span>
              <span className="text-white/85">{t.navContact}</span>
            </nav>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#F8F5F0] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F2994A]" />
              {t.cnt.eyebrow}
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(34px,4.8vw,48px)] font-normal leading-[1.08] tracking-[-0.02em] text-[#F8F5F0]">
              {t.cnt.heroTitle1} <em className="not-italic text-[#F7B77E]">{t.cnt.heroTitleEm}</em>
            </h1>
            <p className="mx-auto max-w-[520px] text-pretty text-[16px] leading-[1.7] text-white/80">
              {t.cnt.heroSub}
            </p>
          </div>
        </section>

        <ContactInfoCards />

        {/* ── Formulaire & colonne infos ── */}
        <section className="py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[55fr_45fr] lg:gap-10">
              <ContactForm />
              <ContactSidebar />
            </div>
          </div>
        </section>

        <ContactFaqSection faqs={faqs} />
        <ContactCta />

        <style>{`
          @keyframes scale-in {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
          }
        `}</style>
      </div>
      <CalmaFooter />
    </>
  );
}

export default function Contact({ faqs }: { faqs: FaqItem[] }) {
  return (
    <CalmaLangProvider>
      <ContactContent faqs={faqs} />
    </CalmaLangProvider>
  );
}
