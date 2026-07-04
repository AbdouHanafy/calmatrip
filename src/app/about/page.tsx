// app/about/page.tsx
import About from '@/views/About';
import type { Metadata } from 'next';
import { buildMetadata } from "@/lib/seo";

// ✅ Single export metadata
export const metadata: Metadata = buildMetadata({
  title: "About Us — Founded in Hammamet, Tunisia",
  description:
    "Learn about Calma Trip — the stress-free travel hub founded in Hammamet in 2026. Our mission: connect travellers with premium services at local prices, backed by 24/7 multilingual support.",
  path: "/about",
  ogImage: "/og/og-about.jpg",
  keywords: [
    "Calma Trip story", "Tunisia travel agency Hammamet",
    "who is Calma Trip", "Tunisia travel company",
  ],
});

export default function AboutPage() {
  return <About />;
}