import { z } from "zod";
export const localizedMediaTextSchema = z.object({
  fr: z.string().trim().max(500).optional(),
  en: z.string().trim().max(500).optional(),
  ar: z.string().trim().max(500).optional(),
});
export const mediaMetadataSchema = z.object({
  title: z.string().trim().max(200).nullable().optional(),
  alt: localizedMediaTextSchema.nullable().optional(),
  caption: localizedMediaTextSchema.nullable().optional(),
  description: localizedMediaTextSchema.nullable().optional(),
  folder: z.string().trim().min(1).max(120).nullable().optional(),
});
export const mediaFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[^\\/\0-\x1f]+$/, "Folder names cannot contain path separators"),
});
