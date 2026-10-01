"use client";
import React from "react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import type { HomeProduct } from "@/lib/activities";
import type { SearchOptions } from "@/lib/searchOptions";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import HomeHero from "@/components/home/HomeHero";
import HomeCategoryChips from "@/components/home/HomeCategoryChips";
import HomeTrustStrip from "@/components/home/HomeTrustStrip";
import HomeCardRow from "@/components/home/HomeCardRow";
import ActivityCard, { type HomeActivity } from "@/components/home/ActivityCard";
import HomeDestinations from "@/components/home/HomeDestinations";
import HomeReviews from "@/components/home/HomeReviews";
import HomePlannerBanner from "@/components/home/HomePlannerBanner";
import ProductCard from "@/components/home/ProductCard";
import ReviewForm from "@/components/review/ReviewForm";

interface Review {
  id: number;
  name: string;
  avatar: string | null;
  rating: number;
  comment: string;
  service: string | null;
  createdAt: string;
}

interface HomeProps {
  activities: HomeActivity[];
  shopProducts: HomeProduct[];
  reviews: Review[];
  searchOptions: SearchOptions;
}

// Review form stays on the homepage — it's the only place travellers can leave one.
function ShareExperienceSection() {
  const { t } = useCalmaLang();
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[560px] rounded-2xl border border-calma-ink/10 bg-white p-6 sm:p-8">
        <h2 className="m-0 text-[20px] font-bold text-calma-ink sm:text-[22px]">
          {t.reviewHeading}
        </h2>
        <p className="mb-6 mt-2 text-[15px] leading-relaxed text-calma-taupe">{t.reviewSub}</p>
        <ReviewForm />
      </div>
    </section>
  );
}

function HomeContent({ activities, shopProducts, reviews, searchOptions }: HomeProps) {
  const { t } = useCalmaLang();
  const services = activities.filter((a) => a.kind === "service");
  const listings = activities.filter((a) => a.kind === "listing");

  return (
    <main className="min-h-screen bg-white pb-12 font-hanken">
      <HomeHero searchOptions={searchOptions} />
      <HomeCategoryChips />
      <HomeTrustStrip />

      {services.length > 0 && (
        <HomeCardRow title={t.home.toursHeading} seeAllHref="/services">
          {services.map((a) => (
            <ActivityCard key={a.key} activity={a} />
          ))}
        </HomeCardRow>
      )}

      <HomeDestinations />

      {listings.length > 0 && (
        <HomeCardRow title={t.home.localHeading} seeAllHref="/explore">
          {listings.map((a) => (
            <ActivityCard key={a.key} activity={a} />
          ))}
        </HomeCardRow>
      )}

      {shopProducts.length > 0 && (
        <HomeCardRow title={t.home.shopHeading} seeAllHref="/marketplace">
          {shopProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </HomeCardRow>
      )}

      <HomeReviews reviews={reviews} />
      <HomePlannerBanner />
      <ShareExperienceSection />
    </main>
  );
}

export default function Home(props: HomeProps) {
  return (
    <CalmaLangProvider>
      <CalmaHeader active="home" />
      <HomeContent {...props} />
      <CalmaFooter />
    </CalmaLangProvider>
  );
}
