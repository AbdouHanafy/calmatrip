import type { ExploreListing, Product, Service } from "@prisma/client";

// One bookable thing as shown on a card — either a Service (transfer,
// excursion…) or an approved Explore listing. Shared by the homepage and
// /search so every card is built the same way.
export interface HomeActivity {
  key: string;
  href: string;
  kind: "service" | "listing";
  title: string;
  category: string | null;
  place: string | null;
  duration: string | null;
  price: string | null;
  image: string | null;
}

export interface HomeProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string | null;
}

export function serviceToActivity(s: Service): HomeActivity {
  return {
    key: `service-${s.id}`,
    href: `/services/${s.id}`,
    kind: "service",
    title: s.title,
    category: s.category,
    place: null,
    duration: s.duration,
    price: s.price,
    image: s.image,
  };
}

// Explore has no per-listing page yet, so the card deep-links to a search for it.
export function listingToActivity(l: ExploreListing): HomeActivity {
  return {
    key: `listing-${l.id}`,
    href: `/explore?search=${encodeURIComponent(l.title)}`,
    kind: "listing",
    title: l.title,
    category: l.category,
    place: l.city,
    duration: l.duration ?? l.openingHours,
    price: l.price,
    image: l.image,
  };
}

export function toHomeProduct(p: Product): HomeProduct {
  return { id: p.id, name: p.name, price: p.price, category: p.category, image: p.image };
}
