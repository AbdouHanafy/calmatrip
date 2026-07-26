import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Invalid rating").max(5, "Invalid rating"),
  comment: z.string().trim().min(1, "Missing fields").max(2000),
  service: z.string().trim().max(200).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
