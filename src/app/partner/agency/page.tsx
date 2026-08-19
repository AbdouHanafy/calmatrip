import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PartnerAgencyPage from "@/views/partner/PartnerAgencyPage";

export const metadata: Metadata = buildMetadata({
  title: "Devenir agence partenaire",
  description:
    "Publiez vos activités, excursions et hébergements sur Calma Trip Explore — inscription gratuite, soumise à validation.",
  path: "/partner/agency",
});

export default function PartnerAgency() {
  return <PartnerAgencyPage />;
}
