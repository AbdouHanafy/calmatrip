import FavoritesPage from "@/views/FavoritesPage";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mes favoris",
  description: "Retrouvez vos produits, activités, musées et événements favoris sur Calma Trip.",
  path: "/favorites",
  noIndex: true,
});

export default function Favorites() {
  return <FavoritesPage />;
}
