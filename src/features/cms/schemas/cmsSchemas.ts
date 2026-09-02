import { z } from "zod";
import { CONTENT_STATUSES, FIELD_TYPES, FORM_FIELD_TYPES } from "../types";
import { REGISTERED_BLOCK_TYPES, validateBlockData } from "../blocks/registry";

const key = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z][a-zA-Z0-9_]*$/);
const slug = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const localizedText = z.object({
  fr: z.string().max(500).optional(),
  en: z.string().max(500).optional(),
  ar: z.string().max(500).optional(),
});
const option = z.object({ label: localizedText, value: z.string().trim().min(1).max(200) });

export const conditionSchema = z
  .object({
    field: key,
    operator: z.enum(["EQUALS", "NOT_EQUALS", "IN", "NOT_IN", "IS_EMPTY", "IS_NOT_EMPTY"]),
    value: z
      .union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number()]))])
      .optional(),
    action: z.enum(["SHOW", "HIDE"]).default("SHOW"),
  })
  .superRefine((rule, ctx) => {
    if (!["IS_EMPTY", "IS_NOT_EMPTY"].includes(rule.operator) && rule.value === undefined) {
      ctx.addIssue({ code: "custom", message: "This operator requires a value", path: ["value"] });
    }
  });

export const fieldDefinitionSchema = z
  .object({
    id: z.string().cuid().optional(),
    key,
    label: z.string().trim().min(1).max(120),
    type: z.enum(FIELD_TYPES),
    required: z.boolean().default(false),
    unique: z.boolean().default(false),
    localized: z.boolean().default(false),
    searchable: z.boolean().default(false),
    sortable: z.boolean().default(false),
    position: z.number().int().min(0).default(0),
    placeholder: localizedText.optional(),
    helpText: localizedText.optional(),
    defaultValue: z.unknown().optional(),
    validation: z
      .object({
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().max(200).optional(),
      })
      .optional(),
    options: z.array(option).max(200).optional(),
    relation: z.object({ contentType: slug, multiple: z.boolean().default(false) }).optional(),
    visibility: z
      .object({ hidden: z.boolean().default(false), readOnly: z.boolean().default(false) })
      .optional(),
  })
  .superRefine((field, ctx) => {
    if (["SELECT", "MULTI_SELECT", "RADIO"].includes(field.type) && !field.options?.length) {
      ctx.addIssue({
        code: "custom",
        message: `${field.type} requires options`,
        path: ["options"],
      });
    }
    if (
      field.options &&
      new Set(field.options.map((option) => option.value)).size !== field.options.length
    ) {
      ctx.addIssue({ code: "custom", message: "Option values must be unique", path: ["options"] });
    }
    if (
      field.validation?.min !== undefined &&
      field.validation?.max !== undefined &&
      field.validation.min > field.validation.max
    ) {
      ctx.addIssue({ code: "custom", message: "min cannot exceed max", path: ["validation"] });
    }
    if (["RELATION", "MULTI_RELATION"].includes(field.type) && !field.relation) {
      ctx.addIssue({
        code: "custom",
        message: `${field.type} requires a relation target`,
        path: ["relation"],
      });
    }
    if (field.validation?.pattern) {
      try {
        new RegExp(field.validation.pattern);
      } catch {
        ctx.addIssue({
          code: "custom",
          message: "Invalid regular expression",
          path: ["validation", "pattern"],
        });
      }
    }
  });

export const contentTypeInputSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    slug,
    description: z.string().max(2000).optional(),
    icon: z.string().max(80).optional(),
    publishingEnabled: z.boolean().default(true),
    localized: z.boolean().default(true),
    active: z.boolean().default(true),
    listColumns: z.array(key).max(12).optional(),
    fields: z.array(fieldDefinitionSchema).min(1).max(100),
  })
  .superRefine((value, ctx) => {
    const keys = value.fields.map((field) => field.key);
    if (new Set(keys).size !== keys.length)
      ctx.addIssue({ code: "custom", message: "Field keys must be unique", path: ["fields"] });
    for (const [index, column] of (value.listColumns ?? []).entries()) {
      if (!keys.includes(column))
        ctx.addIssue({
          code: "custom",
          message: "List column must reference an existing field",
          path: ["listColumns", index],
        });
    }
  });

export const contentEntryInputSchema = z.object({
  slug,
  locale: z.enum(["fr", "en", "ar"]).default("fr"),
  status: z.enum(CONTENT_STATUSES).default("DRAFT"),
  data: z.record(z.string(), z.unknown()),
  seo: z.record(z.string(), z.unknown()).optional(),
});

export const blockSchema = z
  .object({
    type: z.enum(REGISTERED_BLOCK_TYPES),
    data: z.record(z.string(), z.unknown()),
  })
  .superRefine((block, ctx) => {
    const result = validateBlockData(block.type, block.data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ code: "custom", message: issue.message, path: ["data", ...issue.path] });
      }
    }
  });

export const seoSchema = z
  .object({
    title: z.string().max(70).optional(),
    metaDescription: z.string().max(180).optional(),
    canonicalUrl: z.string().url().optional(),
    ogTitle: z.string().max(100).optional(),
    ogDescription: z.string().max(200).optional(),
    ogImage: z.string().url().optional(),
    index: z.boolean().default(true),
    follow: z.boolean().default(true),
    primaryKeyword: z.string().max(100).optional(),
    secondaryKeywords: z.array(z.string().max(100)).max(20).optional(),
    breadcrumbTitle: z.string().max(100).optional(),
    sitemap: z.boolean().default(true),
  })
  .optional();

export const pageInputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug,
  locale: z.enum(["fr", "en", "ar"]).default("fr"),
  status: z.enum(CONTENT_STATUSES).default("DRAFT"),
  seo: seoSchema,
  blocks: z.array(blockSchema).max(100).default([]),
});

const formFieldSchema = z
  .object({
    key,
    label: localizedText,
    type: z.enum(FORM_FIELD_TYPES),
    required: z.boolean().default(false),
    position: z.number().int().min(0).default(0),
    placeholder: localizedText.optional(),
    helpText: localizedText.optional(),
    defaultValue: z.unknown().optional(),
    validation: z
      .object({
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().max(200).optional(),
      })
      .optional(),
    options: z.array(option).max(200).optional(),
    condition: conditionSchema.optional(),
  })
  .superRefine((field, ctx) => {
    if (["SELECT", "MULTI_SELECT", "RADIO"].includes(field.type) && !field.options?.length)
      ctx.addIssue({ code: "custom", message: "Options are required", path: ["options"] });
  });

export const formInputSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    slug,
    description: localizedText.optional(),
    status: z.enum(CONTENT_STATUSES).default("DRAFT"),
    settings: z
      .object({
        progressIndicator: z.boolean().default(true),
        saveDraft: z.boolean().default(false),
        submitLabel: localizedText.optional(),
      })
      .optional(),
    steps: z
      .array(
        z.object({
          title: localizedText,
          description: localizedText.optional(),
          position: z.number().int().min(0),
          condition: conditionSchema.optional(),
          fields: z.array(formFieldSchema).min(1).max(100),
        }),
      )
      .min(1)
      .max(20),
  })
  .superRefine((form, ctx) => {
    const fields = form.steps.flatMap((step) => step.fields);
    const keys = fields.map((field) => field.key);
    if (new Set(keys).size !== keys.length)
      ctx.addIssue({
        code: "custom",
        message: "Field keys must be unique across the form",
        path: ["steps"],
      });
    const known = new Set(keys);
    for (const [stepIndex, step] of form.steps.entries()) {
      if (step.condition && !known.has(step.condition.field))
        ctx.addIssue({
          code: "custom",
          message: "Condition references an unknown field",
          path: ["steps", stepIndex, "condition", "field"],
        });
      for (const [fieldIndex, field] of step.fields.entries())
        if (
          field.condition &&
          (!known.has(field.condition.field) || field.condition.field === field.key)
        )
          ctx.addIssue({
            code: "custom",
            message: "Condition must reference another existing field",
            path: ["steps", stepIndex, "fields", fieldIndex, "condition", "field"],
          });
    }
  });

export const redirectSchema = z
  .object({
    source: z.string().startsWith("/").max(500),
    destination: z
      .string()
      .refine(
        (value) => value.startsWith("/") || /^https:\/\//i.test(value),
        "Use an internal path or HTTPS URL",
      ),
    statusCode: z.union([z.literal(301), z.literal(302)]),
    active: z.boolean().default(true),
  })
  .refine((value) => value.source !== value.destination, {
    message: "A redirect cannot point to itself",
    path: ["destination"],
  });
