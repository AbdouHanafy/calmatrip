export type { ImageEntry } from "@/components/admin/shared/imageEntry";
export { parseImages, serializeImages } from "@/components/admin/shared/imageSerialization";

export type Service = {
  id: number;
  title: string;
  subtitle?: string | null;
  description: string;
  price: string;
  active: boolean;
  category: string | null;
  duration?: string | null;
  popular: boolean;
  image?: string | null;
  features?: unknown;
  destinations?: { id: number; name: string }[];
};

export type ServiceFormData = {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  category: string;
  duration: string;
  active: boolean;
  popular: boolean;
  features: string[];
  /** Empty = offered in every destination. */
  destinationIds: number[];
};

export const emptyServiceForm: ServiceFormData = {
  title: "",
  subtitle: "",
  description: "",
  price: "",
  category: "Transport",
  duration: "",
  active: true,
  popular: false,
  features: [],
  destinationIds: [],
};

// Matches the categories mapService.ts actually branches on (src/lib/services/mapService.ts) —
// keep in sync so a category picked here always maps to a real icon/color on the public site.
export const SERVICE_CATEGORIES = ["all", "Transport", "Excursion", "Activity"];

export function parseFeatures(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((f) => typeof f === "string");
  return [];
}
