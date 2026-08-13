import { Car, Plane, MapPin, Users, Compass } from "lucide-react";

export interface DBService {
  id: number;
  title: string;
  subtitle?: string | null;
  description: string;
  price: string;
  category?: string | null;
  duration?: string | null;
  popular: boolean;
  active: boolean;
  features: string[];
  image?: string | null;
}

export interface MappedService {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  duration: string;
  badge?: string;
  features: string[];
  images: string[];
  color: string;
}

export const DESCRIPTION_LIMIT = 280;

export function parseImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as string[];
  } catch {}
  return [raw];
}

export function htmlTextLength(html: string): number {
  return html.replace(/<[^>]+>/g, "").trim().length;
}

export function mapService(s: DBService): MappedService {
  const category = (s.category ?? "").toLowerCase();
  const title = s.title.toLowerCase();

  let icon: React.ElementType = Car;
  let color = "#F2994A";

  if (category === "transport" || category === "transfer") {
    icon = title.includes("airport") ? Plane : Car;
    color = "#4A667D";
  } else if (category === "excursion") {
    icon = MapPin;
    color = "#F2994A";
  } else if (category === "group") {
    icon = Users;
    color = "#F7B77E";
  } else if (category === "activity") {
    icon = Compass;
    color = "#F7B77E";
  }

  let features: string[] = [];
  if (Array.isArray(s.features)) features = s.features as string[];
  else if (typeof s.features === "string") {
    try {
      features = JSON.parse(s.features);
    } catch {}
  }

  return {
    id: s.id.toString(),
    icon,
    title: s.title,
    subtitle: s.subtitle ?? category,
    description: s.description,
    price: s.price,
    duration: s.duration ?? "Custom",
    badge: s.popular ? "Popular" : undefined,
    features,
    images: parseImages(s.image),
    color,
  };
}
