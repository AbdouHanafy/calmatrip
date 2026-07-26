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
};

export const SERVICE_CATEGORIES = ["all", "Transport", "Excursion", "Group"];

export function parseFeatures(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((f) => typeof f === "string");
  return [];
}
