import type { Metadata } from "next";
import B2BServices from "@/views/b2b/B2BServices";

export const metadata: Metadata = {
  title: "Mes services — Espace partenaire | Calma Trip",
  robots: { index: false, follow: false },
};

export default function B2BServicesPage() {
  return <B2BServices />;
}
