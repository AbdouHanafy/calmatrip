import type { Metadata } from "next";
import TermsOfSalePage from "@/views/legal/TermsOfSalePage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Conditions générales de vente",
  description:
    "Conditions applicables aux réservations de prestations touristiques et aux achats sur la marketplace Calma Trip.",
  path: "/conditions-generales-de-vente",
});

export default function Page() {
  return <TermsOfSalePage />;
}
