import type { Metadata } from "next";
import { AuthFinish } from "@/components/auth/AuthFinish";

export const metadata: Metadata = {
  title: "Finalisation — Calma Trip",
  robots: { index: false, follow: false },
};

export default function AuthFinishPage() {
  return <AuthFinish />;
}
