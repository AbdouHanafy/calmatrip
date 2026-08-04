import type { Metadata } from "next";
import B2BExplore from "@/views/b2b/B2BExplore";

export const metadata: Metadata = {
  title: "Mes annonces Explore — Espace partenaire | Calma Trip",
  robots: { index: false, follow: false },
};

export default function B2BExplorePage() {
  return <B2BExplore />;
}
