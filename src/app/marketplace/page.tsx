import type { Metadata } from "next";
import MarketplacePage from "@/views/Marketplace";
import { buildMetadata } from "@/lib/seo";
import { getPublicProducts } from "@/repositories/productRepository";

export const metadata: Metadata = buildMetadata({
  title: "Sahara Marketplace — Premium Tunisian Souvenirs",
  description:
    "Shop authentic Tunisian souvenirs, local products, clothing, and accessories from CalmaTrip partners.",
  path: "/marketplace",
});

interface MarketplaceSearchParams {
  search?: string;
  category?: string;
  sort?: string;
}

export default async function Marketplace({
  searchParams,
}: {
  searchParams: Promise<MarketplaceSearchParams>;
}) {
  const { search, category, sort } = await searchParams;
  const { products, categories } = await getPublicProducts({ search, category, sort });

  return (
    <MarketplacePage products={JSON.parse(JSON.stringify(products))} categories={categories} />
  );
}
