import type { Metadata } from "next";
import B2BOverview from "@/views/b2b/B2BOverview";

export const metadata: Metadata = {
  title: "Espace partenaire — Calma Trip",
  robots: { index: false, follow: false },
};

export default function B2BPage() {
  return <B2BOverview />;
}
