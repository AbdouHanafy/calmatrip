// app/page.tsx
import HomeComponent from "@/views/Home";
import type { Metadata } from "next";
import { buildMetadata, faqSchema, SITE } from "@/lib/seo";
import { getPublicProducts } from "@/repositories/productRepository";
import { getApprovedReviews } from "@/repositories/reviewRepository";
import { getPublicExploreListings } from "@/repositories/exploreListingRepository";

// ✅ Single export metadata — uses buildMetadata + JSON-LD inline
export const metadata: Metadata = {
  ...buildMetadata({
    title: "Stress-Free Travel in Tunisia",
    description:
      "Calma Trip — Tunisia's trusted travel hub. Book private transfers, camel treks, 4x4 tours, catamaran trips and cultural excursions at local prices. Founded in Hammamet. 24/7 support in English, French & Arabic.",
    path: "/",
    keywords: [
      "travel Tunisia",
      "book excursion Tunisia",
      "private transfer Hammamet",
      "Tunisia travel hub",
      "stress-free Tunisia",
    ],
  }),
  // WebSite schema + FAQ injected via the `other` field
  other: {
    "script:ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE.url}/services?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      faqSchema([
        {
          q: "What services does Calma Trip offer in Tunisia?",
          a: "Calma Trip offers private airport transfers, camel treks, 4x4 desert tours, catamaran sailing trips, cultural excursions, and scenic flights across Tunisia.",
        },
        {
          q: "Where is Calma Trip based?",
          a: "Calma Trip is based in Hammamet, Tunisia, and covers all major destinations including Tunis, Sousse, Djerba, and the Sahara.",
        },
        {
          q: "Does Calma Trip offer 24/7 support?",
          a: "Yes. Our destination specialists are available 24/7 in English, French, and Arabic.",
        },
        {
          q: "Are Calma Trip prices local or tourist rates?",
          a: "We pride ourselves on offering real local prices — no inflated tourist rates.",
        },
        {
          q: "How do I book a service with Calma Trip?",
          a: "You can book instantly on our website at calmatrip.com, choose your service, date, and time, and receive instant confirmation by email.",
        },
      ]),
    ]),
  },
};

export default async function HomePage() {
  const [{ products }, reviews, exploreListings] = await Promise.all([
    getPublicProducts({ sort: "newest" }),
    getApprovedReviews(),
    getPublicExploreListings(),
  ]);

  return (
    <HomeComponent
      shopProducts={JSON.parse(JSON.stringify(products.slice(0, 3)))}
      reviews={JSON.parse(JSON.stringify(reviews))}
      experiences={JSON.parse(JSON.stringify(exploreListings.slice(0, 3)))}
    />
  );
}
