import { z } from "zod";

const sizesField = z.array(z.string()).nullable().optional();

export const productCreateSchema = z.object({
  name: z.string().trim().min(1, "Missing required fields"),
  price: z.coerce.number().positive("Invalid price"),
  category: z.string().trim().min(1, "Missing required fields"),
  image: z.string().trim().nullable().optional(),
  description: z.string().trim().min(1, "Missing required fields"),
  stock: z.coerce.number().int().min(0, "Invalid stock").optional(),
  sizes: sizesField,
});

export const productUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  price: z.coerce.number().positive("Invalid price").optional(),
  category: z.string().trim().min(1).optional(),
  image: z.string().trim().nullable().optional(),
  description: z.string().trim().min(1).optional(),
  stock: z.coerce.number().int().min(0, "Invalid stock").optional(),
  sizes: sizesField,
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
