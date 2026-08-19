import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PartnerArtisanPage from "@/views/partner/PartnerArtisanPage";

export const metadata: Metadata = buildMetadata({
  title: "Devenir artisan partenaire",
  description:
    "Vendez vos créations artisanales sur la Marketplace Calma Trip — inscription gratuite, soumise à validation.",
  path: "/partner/artisan",
});

export default function PartnerArtisan() {
  return <PartnerArtisanPage />;
}
