import { z } from "zod";

export const navigationStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const localizedNavigationLabelSchema = z
  .object({
    fr: z.string().trim().max(120).optional(),
    en: z.string().trim().max(120).optional(),
    ar: z.string().trim().max(120).optional(),
  })
  .refine((label) => Object.values(label).some(Boolean), "At least one label is required");

export const navigationInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  key: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, "Use a lowercase kebab-case key"),
  status: navigationStatusSchema.default("DRAFT"),
});

export const navigationPatchSchema = navigationInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one change is required");

const optionalPageId = z.string().cuid().nullable().optional();
const optionalItemId = z.string().trim().min(1).max(191).nullable().optional();

export const navigationItemInputSchema = z
  .object({
    label: localizedNavigationLabelSchema,
    type: z.enum(["PAGE", "CUSTOM", "EXTERNAL", "GROUP"]),
    pageId: optionalPageId,
    url: z.string().trim().max(2_000).optional().default(""),
    target: z.enum(["_self", "_blank"]).default("_self"),
    visible: z.boolean().default(true),
    parentId: optionalItemId,
    position: z.number().int().min(0).max(10_000).default(0),
  })
  .superRefine((item, context) => {
    if (item.type === "PAGE" && !item.pageId)
      context.addIssue({ code: "custom", path: ["pageId"], message: "Select a CMS page" });
    if (item.type === "EXTERNAL") {
      try {
        const parsed = new URL(item.url);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      } catch {
        context.addIssue({
          code: "custom",
          path: ["url"],
          message: "Use a valid HTTP or HTTPS URL",
        });
      }
    }
    if (item.type === "CUSTOM" && (!item.url.startsWith("/") || item.url.startsWith("//")))
      context.addIssue({
        code: "custom",
        path: ["url"],
        message: "Internal paths must start with one slash",
      });
  });

export const navigationItemPatchSchema = navigationItemInputSchema;

export const navigationOrderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(191),
        parentId: z.string().trim().min(1).max(191).nullable(),
        position: z.number().int().min(0).max(10_000),
      }),
    )
    .max(300),
});
