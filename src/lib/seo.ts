// ─── lib/seo.ts ───────────────────────────────────────────────────────────────
// Centralised SEO config for Calma Trip.
// Import buildMetadata() in every page to generate consistent metadata.

import type { Metadata } from "next";

export const SITE = {
  name: "Calma Trip",
  url: "https://www.calmatrip.com",
  locale: "en_US",
  twitterHandle: "@calmatrip",
  themeColor: "#0C1F14",

  // Default OG image — served by the dynamic generator at src/app/opengraph-image.tsx
  // (no static file needed; Next.js renders and serves it at this route).
  defaultOgImage: "/opengraph-image",

  description:
    "Calma Trip is Tunisia's stress-free travel hub. Private transfers, camel treks, catamaran trips, 4x4 tours, cultural excursions — booked once, perfectly delivered. Local prices. 24/7 multilingual support.",

  keywords: [
    // Brand
    "Calma Trip",
    "calmatrip",
    "calma trip tunisia",
    // Core services
    "private transfer Tunisia",
    "airport transfer Tunisia",
    "excursion Tunisia",
    "day trip Tunisia",
    "camel trek Tunisia",
    "4x4 desert tour Tunisia",
    "catamaran trip Tunisia",
    "cultural excursion Tunisia",
    "scenic flight Tunisia",
    // Destinations
    "Hammamet transfer",
    "Sousse transfer",
    "Djerba excursion",
    "Tunis city tour",
    "Sahara tour Tunisia",
    "Sidi Bou Said visit",
    "Carthage tour",
    "El Jem colosseum trip",
    "Matmata tour",
    // Intent
    "book taxi Tunisia",
    "Tunisia tourism",
    "things to do Tunisia",
    "Tunisia travel guide",
    "stress-free Tunisia travel",
    "Tunisia tour operator",
    "local prices Tunisia tours",
    // Long-tail
    "airport transfer Tunis Carthage",
    "private driver Tunisia",
    "best excursions Tunisia 2026",
  ],
} as const;

// ─── buildMetadata ─────────────────────────────────────────────────────────────

interface PageSEO {
  title: string; // Page-specific title (without site name)
  description: string;
  path: string; // e.g. "/services"
  ogImage?: string; // Override default OG image
  keywords?: string[]; // Extra page-level keywords (merged with base)
  noIndex?: boolean; // For admin / private pages
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  keywords = [],
  noIndex = false,
}: PageSEO): Metadata {
  const url = `${SITE.url}${path}`;
  const image = ogImage ?? SITE.defaultOgImage;
  const imageUrl = image.startsWith("http") ? image : `${SITE.url}${image}`;
  const fullTitle = `${title} | ${SITE.name}`;
  const allKeywords = [...SITE.keywords, ...keywords].join(", ");

  return {
    // ── Core ──
    // Plain title (no "| Calma Trip" suffix) — the root layout's
    // `title.template` already appends it. Adding it here too produced
    // "Page | Calma Trip | Calma Trip" on every single page.
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: "Calma Trip", url: SITE.url }],
    creator: "Calma Trip",
    publisher: "Calma Trip",
    category: "travel",

    // ── Canonical ──
    // No `languages` alternates: FR/EN/AR are a client-side toggle
    // (see src/lib/calma/i18n.tsx), not separate routes — every language
    // renders at this same URL, so a single canonical is correct. Emitting
    // hreflang alternates that pointed at non-existent /fr and /ar prefixes
    // was a real bug (Search Console would report 404 hreflang targets).
    alternates: {
      canonical: url,
    },

    // ── Robots ──
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },

    // ── Open Graph ──
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE.name} — ${title}`,
        },
      ],
    },

    // ── Twitter / X ──
    twitter: {
      card: "summary_large_image",
      site: SITE.twitterHandle,
      creator: SITE.twitterHandle,
      title: fullTitle,
      description,
      images: [imageUrl],
    },

    // ── Verification — read from env so every page shares the same real
    // code once configured; omitted entirely until then instead of shipping
    // a fake placeholder that would silently fail Search Console's check.
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
      : {}),
  };
}

// ─── JSON-LD helpers ───────────────────────────────────────────────────────────

/** Organization schema — add to root layout */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/images/logo-calma-trip.jpg`,
    image: `${SITE.url}${SITE.defaultOgImage}`,
    description: SITE.description,
    foundingDate: "2026",
    foundingLocation: {
      "@type": "Place",
      name: "Hammamet, Tunisia",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hammamet",
      addressCountry: "TN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+216-21-622-972",
        contactType: "customer support",
        availableLanguage: ["English", "French", "Arabic"],
        hoursAvailable: "Mo-Su 00:00-23:59",
      },
      {
        "@type": "ContactPoint",
        email: "contact@calmatrip.com",
        contactType: "customer service",
      },
    ],
    sameAs: [
      "https://www.instagram.com/calmatrip",
      "https://www.facebook.com/calmatrip",
      "https://www.tiktok.com/@calmatrip",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tunisia Travel Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Private Airport Transfer" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Camel Trek Sahara" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "4x4 Desert Tour" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Catamaran Trip" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cultural Excursion" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Scenic Flight" } },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "500",
      bestRating: "5",
    },
  };
}

/** BreadcrumbList schema */
export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

/** FAQ schema — pass array of {q, a} */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Individual Service / Product schema */
export function serviceSchema(s: {
  name: string;
  description: string;
  price: string;
  currency?: string;
  image?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    provider: { "@type": "TravelAgency", name: SITE.name, url: SITE.url },
    areaServed: { "@type": "Country", name: "Tunisia" },
    offers: {
      "@type": "Offer",
      price: s.price.replace(/[^0-9.]/g, ""),
      priceCurrency: s.currency ?? "TND",
      availability: "https://schema.org/InStock",
      url: s.url ?? `${SITE.url}/services`,
    },
    ...(s.image ? { image: s.image.startsWith("http") ? s.image : `${SITE.url}${s.image}` } : {}),
  };
}
