import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PartnerLandingPage from "@/views/partner/PartnerLandingPage";

export const metadata: Metadata = buildMetadata({
  title: "Devenir partenaire — Artisan ou Agence",
  description:
    "Rejoignez le réseau de partenaires Calma Trip en tant qu'artisan ou agence de voyage en Tunisie.",
  path: "/partner",
});

export default function Partner() {
  return <PartnerLandingPage />;
}
