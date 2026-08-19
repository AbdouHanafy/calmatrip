import { AuthPage } from "@/components/auth/AuthPage";
import type { PartnerType } from "@/hooks/auth/useAuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir partenaire — Calma Trip",
  description: "Rejoignez Calma Trip en tant qu'artisan ou agence partenaire.",
  robots: { index: false, follow: false },
};

export default async function PartnerRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const initialPartnerType: PartnerType | null =
    type === "artisan" || type === "agency" ? type : null;

  return (
    <AuthPage
      mode="register"
      audience="partner"
      callbackUrl="/b2b"
      initialPartnerType={initialPartnerType}
    />
  );
}
