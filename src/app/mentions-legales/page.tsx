import type { Metadata } from "next";
import LegalNoticePage from "@/views/legal/LegalNoticePage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mentions légales",
  description: "Informations légales relatives à l'éditeur et à l'hébergeur du site Calma Trip.",
  path: "/mentions-legales",
  noIndex: true,
});

export default function Page() {
  return <LegalNoticePage />;
}
