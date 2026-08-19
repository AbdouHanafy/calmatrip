import { z } from "zod";

export const communityPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(10, "Votre message doit contenir au moins 10 caractères.")
    .max(2000),
  image: z.string().trim().url().optional().nullable(),
});

export type CommunityPostInput = z.infer<typeof communityPostSchema>;
