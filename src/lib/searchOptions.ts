import { getActiveDestinations } from "@/repositories/destinationRepository";
import { getSearchableServices } from "@/repositories/serviceRepository";

// Everything the search bar offers — all of it managed in the admin
// (Destinations, Experiences & services). Loaded server-side and passed down.
export interface SearchOptions {
  destinations: { id: number; name: string }[];
  /** destinationIds empty = offered in every destination. */
  services: { id: number; title: string; destinationIds: number[] }[];
}

export async function getSearchOptions(): Promise<SearchOptions> {
  const [destinations, services] = await Promise.all([
    getActiveDestinations(),
    getSearchableServices(),
  ]);
  return {
    destinations,
    services: services.map((s) => ({
      id: s.id,
      title: s.title,
      destinationIds: s.destinations.map((d) => d.id),
    })),
  };
}
