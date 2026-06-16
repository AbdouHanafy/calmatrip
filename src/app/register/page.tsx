import { AuthPage } from "@/components/auth/AuthPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Calmatrip",
  description: "Create your Calmatrip account with Google to book transport and excursions.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <AuthPage mode="register" callbackUrl={callbackUrl ?? "/dashboard"} />;
}
