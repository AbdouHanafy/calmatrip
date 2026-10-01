"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import PageHeader from "@/components/calma/PageHeader";
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
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={t.svc.heroTitle}
          subtitle={t.svc.heroSub}
          image="/images/tunisia.jpeg"
          imageAlt="Sidi Bou Saïd, Tunisie"
          crumbs={[{ label: t.cnt.breadcrumbHome, href: "/" }, { label: t.navServices }]}
        />
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <ServicesSearchBar value={query} onChange={setQuery} />
        </div>

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
      </main>
      <CalmaFooter />
    </>
  );
}

export default function Services({ services }: { services: DBService[] }) {
  return (
    <CalmaLangProvider>
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ServicesContent services={services} />
      </Suspense>
    </CalmaLangProvider>
  );
}
