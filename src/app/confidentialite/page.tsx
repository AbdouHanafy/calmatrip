import type { Metadata } from "next";
import PrivacyPolicyPage from "@/views/legal/PrivacyPolicyPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Politique de confidentialité",
  description:
    "Comment Calma Trip collecte, utilise et protège vos données personnelles lors de vos réservations et achats.",
  path: "/confidentialite",
});

export default function Page() {
  return <PrivacyPolicyPage />;
}
