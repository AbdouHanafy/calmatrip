import type { Metadata } from "next";
import B2BProfile from "@/views/b2b/B2BProfile";

export const metadata: Metadata = {
  title: "Mon profil — Espace partenaire | Calma Trip",
  robots: { index: false, follow: false },
};

export default function B2BProfilePage() {
  return <B2BProfile />;
}
