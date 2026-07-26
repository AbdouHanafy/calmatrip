import GuidesPage from "@/views/GuidesPage";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublicGuides } from "@/repositories/guideRepository";

export const metadata: Metadata = buildMetadata({
  title: "Guides pratiques — Voyager en Tunisie",
  description:
    "Visa, transport, monnaie, coutumes locales : nos guides pratiques pour préparer votre voyage en Tunisie.",
  path: "/guides",
});

export default async function Guides() {
  const guides = await getPublicGuides();
  return <GuidesPage guides={JSON.parse(JSON.stringify(guides))} />;
}
