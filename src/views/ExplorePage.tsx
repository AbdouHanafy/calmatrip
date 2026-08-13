"use client";

import { Suspense } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import { useFavorites } from "@/hooks/useFavorites";
import { useExploreFilters } from "@/hooks/explore/useExploreFilters";
import { ExploreSearchBar } from "@/components/explore/ExploreSearchBar";
import { ExploreFilters } from "@/components/explore/ExploreFilters";
import { PlacesGrid } from "@/components/explore/PlacesGrid";
import type { EventItem, MuseumItem, ExploreListingItem } from "@/lib/explore/places";

const MapExplorer = dynamic(() => import("@/components/explore/MapExplorer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-900/50 animate-pulse rounded-3xl flex items-center justify-center font-bold text-gray-400">
      Loading Map...
    </div>
  ),
});

interface ExplorePageContentProps {
  events: EventItem[];
  museums: MuseumItem[];
  listings: ExploreListingItem[];
}

function ExplorePageContent({ events, museums, listings }: ExplorePageContentProps) {
  const { t } = useCalmaLang();
  const { isFavorited, toggleFavorite } = useFavorites();
  const filters = useExploreFilters(events, museums, listings);

  return (
    <>
      <CalmaHeader active="explore" />
      <main className="min-h-screen bg-calma-sand font-hanken pb-32">
        {/* ── Hero — cinematic, photo-backed, sand texture ── */}
        <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden px-6 pb-24 pt-16 text-center sm:px-10">
          <Image
            src="/images/explore/sahara_camel.png"
            alt="Sahara, Tunisie"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(42,38,34,.68) 0%,rgba(42,38,34,.5) 45%,rgba(42,38,34,.82) 100%)",
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
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta" />
              {t.exp.eyebrow}
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(32px,4.4vw,48px)] font-normal leading-[1.05] tracking-[-0.02em] text-calma-cream">
              {t.exp.heroTitle}
            </h1>
            <p className="mx-auto max-w-[520px] text-pretty text-[16px] leading-[1.65] text-white/80">
              {t.exp.heroSub}
            </p>
          </div>
        </section>

        <ExploreSearchBar value={filters.searchQuery} onChange={filters.setSearchQuery} />

        <ExploreFilters
          selectedCategory={filters.selectedCategory}
          onCategoryChange={filters.setSelectedCategory}
          cities={filters.cities}
          selectedCity={filters.selectedCity}
          onCityChange={filters.setSelectedCity}
          budgetLimit={filters.budgetLimit}
          onBudgetChange={filters.setBudgetLimit}
          onGeolocate={filters.handleGeolocation}
          viewMode={filters.viewMode}
          onViewModeChange={filters.setViewMode}
          activeFilters={filters.activeFilters}
          onClearAll={filters.clearFilters}
          sortBy={filters.sortBy}
          onSortChange={filters.setSortBy}
        />

        {/* MAIN CONTENT AREA */}
        <section className="max-w-7xl mx-auto px-6 pt-12">
          {filters.viewMode === "list" ? (
            <PlacesGrid
              places={filters.filteredPlaces}
              isFavorited={isFavorited}
              onToggleFavorite={toggleFavorite}
              onResetFilters={filters.clearFilters}
            />
          ) : (
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-white animate-fade-in">
              <MapExplorer places={filters.filteredPlaces} userLocation={filters.userLocation} />
            </div>
          )}
        </section>
      </main>
      <CalmaFooter />

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

export default function ExplorePage({ events, museums, listings }: ExplorePageContentProps) {
  return (
    <CalmaLangProvider>
      <Suspense fallback={<div className="min-h-screen bg-calma-sand" />}>
        <ExplorePageContent events={events} museums={museums} listings={listings} />
      </Suspense>
    </CalmaLangProvider>
  );
}
