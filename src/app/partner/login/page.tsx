import { AuthPage } from "@/components/auth/AuthPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion partenaire — Calma Trip",
  robots: { index: false, follow: false },
};

export default function PartnerLoginPage() {
  return <AuthPage mode="login" audience="partner" callbackUrl="/b2b" />;
}
