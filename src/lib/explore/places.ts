import {
  Coffee,
  Landmark,
  Mountain,
  Sparkles,
  MapPinned,
  CalendarDays,
  Building2,
  type LucideIcon,
} from "lucide-react";
import type { FavoriteType } from "@/hooks/useFavorites";

export interface Place {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  rating?: number;
  reviews?: number;
  tags?: string[];
  duration?: string;
  startDate?: string;
  openingHours?: string;
  location?: string;
  city: string;
  budget: number; // 1: Cheap, 2: Moderate, 3: Premium
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface EventItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  city: string;
  address: string | null;
  startDate: string;
  price: string | null;
  category: string | null;
  lat: number | null;
  lng: number | null;
}

export interface MuseumItem {
  id: number;
  name: string;
  description: string;
  image: string | null;
  city: string;
  address: string | null;
  openingHours: string | null;
  price: string | null;
  lat: number | null;
  lng: number | null;
}

const FALLBACK_IMAGE = "/images/explore/carthage_ports.png";

function isFree(price: string | null): boolean {
  if (!price) return true;
  return /gratuit|free/i.test(price);
}

export function mapEventToPlace(e: EventItem): Place {
  return {
    id: 100000 + e.id,
    title: e.title,
    category: "Event",
    image: e.image || FALLBACK_IMAGE,
    description: e.description,
    tags: e.category ? [e.category] : undefined,
    startDate: e.startDate,
    location: e.address ?? undefined,
    city: e.city,
    budget: isFree(e.price) ? 1 : 2,
    coordinates: { lat: e.lat ?? 0, lng: e.lng ?? 0 },
  };
}

export function mapMuseumToPlace(m: MuseumItem): Place {
  return {
    id: 200000 + m.id,
    title: m.name,
    category: "Museum",
    image: m.image || FALLBACK_IMAGE,
    description: m.description,
    openingHours: m.openingHours ?? undefined,
    location: m.address ?? undefined,
    city: m.city,
    budget: isFree(m.price) ? 1 : 2,
    coordinates: { lat: m.lat ?? 0, lng: m.lng ?? 0 },
  };
}

// Derives the (favoriteType, favoriteId) pair for a Place, undoing the id
// offset used to keep event/museum ids collision-free with the static mock places.
export function getFavoriteKey(place: Place): { type: FavoriteType; id: number } {
  if (place.category === "Event") return { type: "event", id: place.id - 100000 };
  if (place.category === "Museum") return { type: "museum", id: place.id - 200000 };
  return { type: "place", id: place.id };
}

export const CATEGORY_IDS = [
  "all",
  "Food & Drink",
  "Sight",
  "Activity",
  "Hidden Gem",
  "Event",
  "Museum",
];
export const CATEGORY_ICONS: LucideIcon[] = [
  Sparkles,
  Coffee,
  Landmark,
  Mountain,
  MapPinned,
  CalendarDays,
  Building2,
];

export const STATIC_CITIES = [
  "All Cities",
  "Tunis",
  "Kairouan",
  "Douz",
  "Tozeur",
  "Carthage",
  "Sidi Bou Said",
];

export const allPlaces: Place[] = [
  {
    id: 1,
    title: "Great Mosque of Kairouan",
    category: "Sight",
    image: "/images/explore/kairouan_mosque.png",
    description:
      "One of Islam's oldest mosques with stunning architecture and a majestic courtyard.",
    rating: 4.9,
    reviews: 1240,
    tags: ["History", "Architecture", "Sacred"],
    duration: "1-2 hours",
    city: "Kairouan",
    budget: 1,
    coordinates: { lat: 35.6811, lng: 10.1039 },
  },
  {
    id: 2,
    title: "Café des Nattes",
    category: "Food & Drink",
    image: "/images/explore/sidi_bou_said.png",
    description:
      "Legendary café overlooking Sidi Bou Said, famous for its tea with pine nuts and views.",
    rating: 4.8,
    reviews: 850,
    tags: ["View", "Local Tea", "Sunset"],
    duration: "45 mins",
    city: "Sidi Bou Said",
    budget: 2,
    coordinates: { lat: 36.8711, lng: 10.3458 },
  },
  {
    id: 3,
    title: "Sahara Camel Trek",
    category: "Activity",
    image: "/images/explore/sahara_camel.png",
    description: "Experience the magic of the golden dunes of Douz on a traditional camel caravan.",
    rating: 4.9,
    reviews: 2100,
    tags: ["Desert", "Adventure", "Camping"],
    duration: "3-4 hours",
    city: "Douz",
    budget: 3,
    coordinates: { lat: 33.4611, lng: 9.0203 },
  },
  {
    id: 4,
    title: "Punic Ports, Carthage",
    category: "Hidden Gem",
    image: "/images/explore/carthage_ports.png",
    description:
      "Ancient naval harbors of Carthage, a peaceful site steeped in Punic and Roman history.",
    rating: 4.8,
    reviews: 540,
    tags: ["History", "Coast", "Ruins"],
    city: "Carthage",
    budget: 1,
    coordinates: { lat: 36.8406, lng: 10.3228 },
  },
  {
    id: 5,
    title: "Chebika Oasis",
    category: "Hidden Gem",
    image: "/images/explore/chebika_oasis.png",
    description:
      "A breathtaking mountain oasis featuring waterfalls and lush palms amidst rugged canyons.",
    rating: 4.9,
    reviews: 620,
    tags: ["Nature", "Hiking", "Oasis"],
    city: "Tozeur",
    budget: 2,
    coordinates: { lat: 34.3211, lng: 8.1203 },
  },
  {
    id: 6,
    title: "El Jem Amphitheatre",
    category: "Sight",
    image: "/images/explore/El Jem Amphitheatre.jpg",
    description: "The world's third largest Roman amphitheatre and a UNESCO World Heritage site.",
    rating: 4.9,
    reviews: 3200,
    tags: ["History", "UNESCO", "Colosseum"],
    duration: "2-3 hours",
    city: "Mahdia",
    budget: 1,
    coordinates: { lat: 35.2961, lng: 10.7064 },
  },
];
