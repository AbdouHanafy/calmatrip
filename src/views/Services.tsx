"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import { ServicesStatsStrip } from "@/components/services/ServicesStatsStrip";
import { ServicesSearchBar } from "@/components/services/ServicesSearchBar";
import { ServicesGridSection } from "@/components/services/ServicesGridSection";
import { WhyChooseUs } from "@/components/services/WhyChooseUs";
import { ServicesContactStrip } from "@/components/services/ServicesContactStrip";
import { ServicesCtaSection } from "@/components/services/ServicesCtaSection";
import { BookingPromptModal } from "@/components/services/BookingPromptModal";
import { mapService, type DBService } from "@/lib/services/mapService";

function ServicesContent({ services: dbServices }: { services: DBService[] }) {
  const { t } = useCalmaLang();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => (searchParams?.get("q") ?? "").trim());

  const services = dbServices.filter((s) => s.active !== false).map(mapService);

  const categories = [
    "all",
    ...Array.from(new Set(services.map((s) => s.subtitle).filter(Boolean))),
  ];
  const byCategory =
    activeCategory === "all" ? services : services.filter((s) => s.subtitle === activeCategory);
  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? byCategory.filter((s) =>
        `${s.title} ${s.subtitle} ${s.description.replace(/<[^>]+>/g, " ")}`
          .toLowerCase()
          .includes(needle),
      )
    : byCategory;

  return (
    <>
      <CalmaHeader active="services" />
      <div className="min-h-screen bg-calma-sand font-hanken">
        {/* ── Hero — luxury concierge, photo-backed, topographic texture ── */}
        <section className="relative flex min-h-[300px] items-center justify-center overflow-hidden px-6 py-16 text-center sm:px-10">
          <Image
            src="/images/tunisia.jpeg"
            alt="Sidi Bou Saïd, Tunisie"
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
          {/* subtle sand-ripple texture, replaces literal decorative shapes */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(100deg,transparent 0 26px,#F8F5F0 26px 27px)",
            }}
          />

          <div className="relative z-[2] mx-auto max-w-[640px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta" />
              {t.svc.eyebrow}
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(32px,4.4vw,48px)] font-normal leading-[1.05] tracking-[-0.02em] text-calma-cream">
              {t.svc.heroTitle}
            </h1>
            <p className="mx-auto max-w-[520px] text-pretty text-[16px] leading-[1.65] text-white/80">
              {t.svc.heroSub}
            </p>
          </div>
        </section>

        <ServicesSearchBar value={query} onChange={setQuery} />

        <ServicesStatsStrip />

        <ServicesGridSection
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          q={query}
          onClearQuery={() => setQuery("")}
          filtered={filtered}
          onBook={setSelectedService}
        />

        <WhyChooseUs />
        <ServicesContactStrip />
        <ServicesCtaSection />

        {selectedService && <BookingPromptModal onClose={() => setSelectedService(null)} />}
      </div>
      <CalmaFooter />
    </>
  );
}

export default function Services({ services }: { services: DBService[] }) {
  return (
    <CalmaLangProvider>
      <Suspense fallback={<div className="min-h-screen bg-calma-sand" />}>
        <ServicesContent services={services} />
      </Suspense>
    </CalmaLangProvider>
  );
}
