"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import PageHeader from "@/components/calma/PageHeader";
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
    <div className="flex h-full w-full animate-pulse items-center justify-center rounded-2xl bg-calma-sand font-semibold text-calma-taupe">
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
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={t.exp.heroTitle}
          subtitle={t.exp.heroSub}
          image="/images/explore/sahara_camel.png"
          imageAlt="Sahara, Tunisie"
          crumbs={[{ label: t.cnt.breadcrumbHome, href: "/" }, { label: t.navExplore }]}
        />
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <ExploreSearchBar value={filters.searchQuery} onChange={filters.setSearchQuery} />
        </div>

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
        <section className="mx-auto max-w-[1240px] px-4 pt-8 sm:px-6 lg:px-8">
          {filters.viewMode === "list" ? (
            <PlacesGrid
              places={filters.filteredPlaces}
              isFavorited={isFavorited}
              onToggleFavorite={toggleFavorite}
              onResetFilters={filters.clearFilters}
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-calma-ink/10">
              <MapExplorer places={filters.filteredPlaces} userLocation={filters.userLocation} />
            </div>
          )}
        </section>
      </main>
      <CalmaFooter />
    </>
  );
}

export default function ExplorePage({ events, museums, listings }: ExplorePageContentProps) {
  return (
    <CalmaLangProvider>
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ExplorePageContent events={events} museums={museums} listings={listings} />
      </Suspense>
    </CalmaLangProvider>
  );
}
