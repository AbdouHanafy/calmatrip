import { z } from "zod";

// Anything malformed in the URL is dropped rather than failing the page —
// a shared link with a bad date should still show results.
const lenient = <T extends z.ZodTypeAny>(schema: T) => schema.optional().catch(undefined);

export const searchParamsSchema = z.object({
  q: lenient(z.string().trim().min(2).max(80)),
  destination: lenient(z.string().trim().min(1).max(80)),
  date: lenient(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  adults: lenient(z.coerce.number().int().min(1).max(99)),
  children: lenient(z.coerce.number().int().min(0).max(99)),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
