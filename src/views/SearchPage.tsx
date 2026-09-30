"use client";
import React from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import SearchBar from "@/components/search/SearchBar";
import ActivityCard from "@/components/home/ActivityCard";
import ProductCard from "@/components/home/ProductCard";
import type { HomeActivity, HomeProduct } from "@/lib/activities";
import type { SearchOptions } from "@/lib/searchOptions";
import type { SearchParams } from "@/schemas/search";

interface SearchPageProps {
  params: SearchParams;
  searchOptions: SearchOptions;
  services: HomeActivity[];
  listings: HomeActivity[];
  products: HomeProduct[];
}

// Carries the visitor's date/participants through to the service page.
function withSelection(href: string, params: SearchParams) {
  if (!href.startsWith("/services/")) return href;
  const qs = new URLSearchParams();
  if (params.date) qs.set("date", params.date);
  if (params.adults) qs.set("adults", String(params.adults));
  if (params.children) qs.set("children", String(params.children));
  return qs.size ? `${href}?${qs}` : href;
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 mt-0 text-[20px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[22px]">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {children}
      </div>
    </section>
  );
}

function SearchContent({ params, searchOptions, services, listings, products }: SearchPageProps) {
  const { t } = useCalmaLang();
  const s = t.search;
  const total = services.length + listings.length + products.length;
  const title = params.q
    ? s.resultsTitle.replace("{q}", params.q)
    : params.destination
      ? s.resultsIn.replace("{d}", params.destination)
      : s.emptyTitle;

  return (
    <main className="min-h-[60vh] bg-white pb-16 font-hanken">
      <div className="bg-calma-cream/60">
        <div className="mx-auto max-w-[1240px] px-4 pb-8 pt-8 sm:px-6 lg:px-8">
          <h1 className="mb-1 mt-0 text-[26px] font-bold tracking-[-0.02em] text-calma-ink sm:text-[32px]">
            {title}
          </h1>
          <p className="mb-5 mt-0 text-[15px] text-calma-taupe">
            {s.resultsCount.replace("{n}", String(total))}
          </p>
          <SearchBar
            variant="page"
            options={searchOptions}
            initial={{
              destination: params.destination,
              date: params.date,
              adults: params.adults,
              children: params.children,
            }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {total === 0 && (
          <div className="mt-10 rounded-2xl border border-calma-ink/10 px-6 py-10 text-center">
            <SearchX size={32} className="mx-auto mb-3 text-calma-taupe" />
            <p className="m-0 text-[17px] font-bold text-calma-ink">{s.noResultsTitle}</p>
            <p className="mx-auto mb-4 mt-2 max-w-[460px] text-[14.5px] text-calma-taupe">
              {s.noResultsSub}
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-calma-ink px-5 py-2.5 text-[14px] font-semibold text-white no-underline hover:bg-calma-olive"
            >
              {t.home.plannerContact}
            </Link>
          </div>
        )}

        {services.length > 0 && (
          <ResultSection title={t.home.toursHeading}>
            {services.map((a) => (
              <ActivityCard key={a.key} activity={{ ...a, href: withSelection(a.href, params) }} />
            ))}
          </ResultSection>
        )}
        {listings.length > 0 && (
          <ResultSection title={t.home.localHeading}>
            {listings.map((a) => (
              <ActivityCard key={a.key} activity={a} />
            ))}
          </ResultSection>
        )}
        {products.length > 0 && (
          <ResultSection title={t.home.shopHeading}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ResultSection>
        )}
      </div>
    </main>
  );
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <CalmaLangProvider>
      <CalmaHeader active="explore" />
      <SearchContent {...props} />
      <CalmaFooter />
    </CalmaLangProvider>
  );
}
