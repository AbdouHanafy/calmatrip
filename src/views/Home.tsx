"use client";
import React from "react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHero from "@/components/home/calma/CalmaHero";
import CalmaSearchBar from "@/components/home/calma/CalmaSearchBar";
import CalmaCategories from "@/components/home/calma/CalmaCategories";
import CalmaMarketplacePreview, {
  type FeaturedExperience,
} from "@/components/home/calma/CalmaMarketplacePreview";
import CalmaFeaturedJourneys from "@/components/home/calma/CalmaFeaturedJourneys";
import CalmaTunisianStory from "@/components/home/calma/CalmaTunisianStory";
import CalmaShopPreview from "@/components/home/calma/CalmaShopPreview";
import CalmaWhyBanner from "@/components/home/calma/CalmaWhyBanner";
import CalmaCustomTrip from "@/components/home/calma/CalmaCustomTrip";
import CalmaFinalCTA from "@/components/home/calma/CalmaFinalCTA";
import ReviewsSection from "@/components/home/ReviewsSection";
import ReviewForm from "@/components/review/ReviewForm";
import CalmaFooter from "@/components/calma/CalmaFooter";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string | null;
}

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
  shopProducts: Product[];
  reviews: Review[];
  experiences: FeaturedExperience[];
}

// "Share your experience" — kept as its own small section (real, user-submitted
// reviews only feed ReviewsSection above it) but its copy now comes from the
// dict like every other section, instead of being hardcoded French.
function ShareExperienceSection() {
  const { t } = useCalmaLang();
  return (
    <section className="bg-calma-cream py-24">
      <div className="mx-auto max-w-[720px] px-6 text-center sm:px-10">
        <div className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-calma-terracotta">
          {t.reviewKicker}
        </div>
        <h2 className="mb-3 font-fraunces text-[clamp(28px,3.2vw,38px)] font-normal leading-[1.1] tracking-[-0.02em] text-calma-ink">
          {t.reviewHeading}
        </h2>
        <p className="mx-auto mb-10 max-w-[420px] leading-relaxed text-calma-taupe">
          {t.reviewSub}
        </p>
        <div className="mx-auto max-w-[520px] text-left">
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}

export default function Home({ shopProducts, reviews, experiences }: HomeProps) {
  return (
    <CalmaLangProvider>
      {/* Narrative rhythm: Arrival (hero) -> Discovery (destinations) -> Experience
          (experiences/journeys/story) -> Connection (why us/tailored/reviews) -> Escape (CTA). */}
      <div className="min-h-screen bg-calma-cream font-hanken">
        <CalmaHero />
        <CalmaSearchBar />

        <div className="bg-white">
          <CalmaCategories />
        </div>

        <div className="bg-calma-cream">
          <CalmaMarketplacePreview experiences={experiences} />
        </div>

        <div className="bg-calma-sand">
          <CalmaFeaturedJourneys />
        </div>

        <div className="bg-white">
          <CalmaTunisianStory />
        </div>

        <div className="bg-calma-cream">
          <CalmaWhyBanner />
        </div>

        <div className="bg-calma-sand">
          <CalmaCustomTrip review={reviews[0] ?? null} />
        </div>

        <div className="bg-calma-cream">
          <CalmaShopPreview products={shopProducts} />
        </div>

        {/* Real traveler reviews only — only a client who actually booked a service can
            leave one, which is exactly what makes this credible. No decorative/fabricated
            testimonials here. Section hides itself entirely until someone has submitted one. */}
        <ReviewsSection reviews={reviews} />

        <ShareExperienceSection />

        <div className="bg-calma-cream">
          <CalmaFinalCTA />
        </div>
      </div>
      <CalmaFooter />
    </CalmaLangProvider>
  );
}
