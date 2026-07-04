// app/services/page.tsx
import Services from '@/views/Services';
import type { Metadata } from 'next';
import { buildMetadata } from "@/lib/seo";

// ✅ Single export metadata
export const metadata: Metadata = buildMetadata({
  title: "Our Services — Transfers, Excursions & More",
  description:
    "Browse all Calma Trip travel services: airport transfers, camel treks, 4x4 Sahara tours, catamaran trips, cultural excursions and scenic flights in Tunisia. Instant booking. Local prices.",
  path: "/services",
  ogImage: "/og/og-services.jpg",
  keywords: [
    "Tunisia excursions list", "book camel trek online",
    "airport transfer Tunis", "catamaran Tunisia price",
    "4x4 tour Sahara Tunisia",
  ],
});

export default function ServicesPage() {
  return <Services />;
}