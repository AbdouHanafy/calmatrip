import { AuthPage } from "@/components/auth/AuthPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Calmatrip",
  description: "Sign in with Google to access your Calmatrip dashboard.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <AuthPage mode="login" callbackUrl={callbackUrl ?? "/dashboard"} />;
}
