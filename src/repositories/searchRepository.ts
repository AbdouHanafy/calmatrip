import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

interface SearchFilters {
  /** Free text, matched against titles, categories and descriptions. */
  q?: string;
  /** Destination name as picked in the search bar. */
  destination?: string;
  take?: number;
}

// Site-wide search behind /search. MySQL's default utf8mb4 collation makes
// `contains` case- and accent-insensitive, so "desert" also matches "Désert".
// Only approved (and active) rows surface. With no filter at all it lists
// everything bookable. Products are only searched by text.
export async function searchCatalog({ q, destination, take = 24 }: SearchFilters) {
  const serviceWhere: Prisma.ServiceWhereInput[] = [{ submissionStatus: "approved", active: true }];
  if (q) {
    serviceWhere.push({
      OR: [
        { title: { contains: q } },
        { subtitle: { contains: q } },
        { category: { contains: q } },
        { description: { contains: q } },
      ],
    });
  }
  if (destination) {
    // No destination linked = offered everywhere.
    serviceWhere.push({
      OR: [{ destinations: { none: {} } }, { destinations: { some: { name: destination } } }],
    });
  }

  const listingWhere: Prisma.ExploreListingWhereInput[] = [
    { submissionStatus: "approved", active: true },
  ];
  if (q) {
    listingWhere.push({
      OR: [
        { title: { contains: q } },
        { city: { contains: q } },
        { category: { contains: q } },
        { address: { contains: q } },
        { description: { contains: q } },
      ],
    });
  }
  if (destination) listingWhere.push({ city: { contains: destination } });

  const [services, listings, products] = await Promise.all([
    prisma.service.findMany({
      where: { AND: serviceWhere },
      orderBy: [{ popular: "desc" }, { order: "asc" }],
      take,
    }),
    prisma.exploreListing.findMany({
      where: { AND: listingWhere },
      orderBy: { createdAt: "desc" },
      take,
    }),
    q
      ? prisma.product.findMany({
          where: {
            submissionStatus: "approved",
            OR: [
              { name: { contains: q } },
              { category: { contains: q } },
              { description: { contains: q } },
            ],
          },
          orderBy: { createdAt: "desc" },
          take,
        })
      : Promise.resolve([]),
  ]);

  return { services, listings, products };
}
