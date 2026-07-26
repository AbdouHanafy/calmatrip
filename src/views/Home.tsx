"use client";
import React from "react";
import Image from "next/image";
import { CalmaLangProvider } from "@/lib/calma/i18n";
import CalmaHero from "@/components/home/calma/CalmaHero";
import CalmaSearchBar from "@/components/home/calma/CalmaSearchBar";
import CalmaCategories from "@/components/home/calma/CalmaCategories";
import CalmaMarketplacePreview from "@/components/home/calma/CalmaMarketplacePreview";
import CalmaShopPreview from "@/components/home/calma/CalmaShopPreview";
import CalmaWhyBanner from "@/components/home/calma/CalmaWhyBanner";
import CalmaCustomTrip from "@/components/home/calma/CalmaCustomTrip";
import CalmaTestimonials from "@/components/home/calma/CalmaTestimonials";
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
}

export default function Home({ shopProducts, reviews }: HomeProps) {
  return (
    <CalmaLangProvider>
      {/* Alternating section rhythm — white / ivory / sand / olive — so the page never sits on one flat beige field */}
      <div className="min-h-screen bg-calma-cream font-hanken">
        <CalmaHero />
        <CalmaSearchBar />

        <div className="bg-white">
          <CalmaCategories />
        </div>

        <div className="bg-calma-cream">
          <CalmaMarketplacePreview />
        </div>

        <div className="bg-calma-sand">
          <CalmaShopPreview products={shopProducts} />
        </div>

        <div className="bg-calma-cream">
          <CalmaWhyBanner />
        </div>

        <div className="bg-calma-sand">
          <CalmaCustomTrip />
        </div>

        <div className="bg-white">
          <CalmaTestimonials />
        </div>

        {/* Real traveler reviews (only renders once someone has submitted one) — carries its own sand background */}
        <ReviewsSection reviews={reviews} />

        <section className="bg-calma-sand py-28">
          <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.85fr_1fr]">
              <div className="relative hidden h-[520px] overflow-hidden rounded-calma-block lg:block">
                <Image
                  src="/images/explore/sidi_bou_said.png"
                  alt="Voyageurs à Sidi Bou Saïd"
                  fill
                  sizes="500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-7 left-7 right-7">
                  <p className="font-fraunces text-[22px] italic leading-snug text-white">
                    &ldquo;Votre voix aide le prochain voyageur à choisir en confiance.&rdquo;
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-8">
                  <div className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-calma-terracotta">
                    Votre avis
                  </div>
                  <h2 className="font-fraunces text-[clamp(28px,3.2vw,38px)] font-normal leading-[1.1] tracking-[-0.02em] text-calma-ink">
                    Partagez votre expérience
                  </h2>
                  <p className="mt-3 max-w-[420px] text-calma-taupe leading-relaxed">
                    Votre avis compte pour nous et pour les autres voyageurs.
                  </p>
                </div>
                <ReviewForm />
              </div>
            </div>
          </div>
        </section>

        <div className="bg-calma-cream">
          <CalmaFinalCTA />
        </div>
      </div>
      <CalmaFooter />
    </CalmaLangProvider>
  );
}
