import { z } from "zod";
import { ARTISAN_INTEREST_CATEGORIES } from "@/lib/partners/constants";

// Restricted to the real Service categories an ARTISAN partner can work
// with (also used to drive their B2B onboarding "interests" step) — never
// an arbitrary free-text category from a partner-facing form.
const categoryField = z.enum(ARTISAN_INTEREST_CATEGORIES as unknown as [string, ...string[]]);

export const b2bServiceCreateSchema = z.object({
  title: z.string().trim().min(1, "Missing required fields"),
  subtitle: z.string().trim().nullable().optional(),
  description: z.string().trim().min(1, "Missing required fields"),
  price: z.string().trim().min(1, "Missing required fields"),
  category: categoryField,
  duration: z.string().trim().nullable().optional(),
  image: z.string().trim().nullable().optional(),
});

export const b2bServiceUpdateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  subtitle: z.string().trim().nullable().optional(),
  description: z.string().trim().min(1).optional(),
  price: z.string().trim().min(1).optional(),
  category: categoryField.optional(),
  duration: z.string().trim().nullable().optional(),
  image: z.string().trim().nullable().optional(),
});

export type B2BServiceCreateInput = z.infer<typeof b2bServiceCreateSchema>;
export type B2BServiceUpdateInput = z.infer<typeof b2bServiceUpdateSchema>;
