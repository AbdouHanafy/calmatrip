import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import CommunityPage from "@/views/CommunityPage";

export const metadata: Metadata = buildMetadata({
  title: "Communauté — Partagez votre expérience",
  description:
    "Partagez votre expérience de voyage en Tunisie avec la communauté Calma Trip et rejoignez notre groupe Facebook.",
  path: "/community",
});

export default function Community() {
  return <CommunityPage />;
}
