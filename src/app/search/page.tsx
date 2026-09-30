import type { Metadata } from "next";
import SearchPage from "@/views/SearchPage";
import { buildMetadata } from "@/lib/seo";
import { searchParamsSchema } from "@/schemas/search";
import { searchCatalog } from "@/repositories/searchRepository";
import { getSearchOptions } from "@/lib/searchOptions";
import { listingToActivity, serviceToActivity, toHomeProduct } from "@/lib/activities";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// Result pages are thin and endless — keep them out of the index.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { destination } = searchParamsSchema.parse(await searchParams);
  return buildMetadata({
    title: destination ? `Things to do in ${destination}` : "Search",
    description: "Tours, transfers and activities in Tunisia, booked with a local team.",
    path: "/search",
    noIndex: true,
  });
}

export default async function SearchRoute({ searchParams }: Props) {
  const params = searchParamsSchema.parse(await searchParams);
  const [results, searchOptions] = await Promise.all([
    searchCatalog({ q: params.q, destination: params.destination }),
    getSearchOptions(),
  ]);

  return (
    <SearchPage
      params={params}
      searchOptions={searchOptions}
      services={results.services.map(serviceToActivity)}
      listings={results.listings.map(listingToActivity)}
      products={results.products.map(toHomeProduct)}
    />
  );
}
