import type { Metadata } from "next";
import PartnerOnboardingView from "@/views/b2b/PartnerOnboarding";

export const metadata: Metadata = {
  title: "Devenir partenaire — Calma Trip",
  description: "Rejoignez Calma Trip en tant qu'artisan ou agence partenaire.",
  robots: { index: false, follow: false },
};

export default function PartnerRegisterPage() {
  return <PartnerOnboardingView />;
}
