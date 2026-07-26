import type { Metadata } from "next";
import B2BProducts from "@/views/b2b/B2BProducts";

export const metadata: Metadata = {
  title: "Mes produits — Espace partenaire | Calma Trip",
  robots: { index: false, follow: false },
};

export default function B2BProductsPage() {
  return <B2BProducts />;
}
