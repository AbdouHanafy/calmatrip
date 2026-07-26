import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(1, "Le nom est requis"),
  customerEmail: z.string().trim().email("Email invalide"),
  customerPhone: z.string().trim().optional(),
  address: z.string().trim().min(1, "L'adresse est requise"),
  city: z.string().trim().optional(),
  paymentMethod: z.string().trim().optional(),
  notes: z.string().trim().max(1000).optional(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "Le panier est vide"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
