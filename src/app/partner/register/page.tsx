import { AuthPage } from "@/components/auth/AuthPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir partenaire — Calma Trip",
  description: "Rejoignez Calma Trip en tant qu'artisan ou agence partenaire.",
  robots: { index: false, follow: false },
};

export default function PartnerRegisterPage() {
  return <AuthPage mode="register" audience="partner" callbackUrl="/b2b" />;
}
