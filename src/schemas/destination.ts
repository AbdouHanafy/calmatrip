import { z } from "zod";

export const destinationSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(80, "Nom trop long (80 caractères max)"),
  description: z
    .string()
    .trim()
    .max(300, "Description trop longue (300 caractères max)")
    .default(""),
  active: z.boolean().default(true),
});

// PUT accepts any subset, plus `order` for the up/down arrows in the list.
export const destinationUpdateSchema = destinationSchema.partial().extend({
  order: z.number().int().min(0).optional(),
});

export type DestinationInput = z.infer<typeof destinationSchema>;
