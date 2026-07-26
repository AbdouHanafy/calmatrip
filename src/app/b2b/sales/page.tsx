import type { Metadata } from "next";
import B2BSales from "@/views/b2b/B2BSales";

export const metadata: Metadata = {
  title: "Réservations & ventes — Espace partenaire | Calma Trip",
  robots: { index: false, follow: false },
};

export default function B2BSalesPage() {
  return <B2BSales />;
}
