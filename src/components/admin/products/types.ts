export type { ImageEntry } from "@/components/admin/shared/imageEntry";
export { parseImages, serializeImages } from "@/components/admin/shared/imageSerialization";

export const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export type ProductFormData = {
  name: string;
  price: string;
  category: string;
  description: string;
  stock: string;
  sizes: string[];
};

export const EMPTY_PRODUCT_FORM: ProductFormData = {
  name: "",
  price: "",
  category: "",
  description: "",
  stock: "100",
  sizes: [],
};
