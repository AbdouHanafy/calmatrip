import { z } from "zod";

export type EditorField = {
  label: string;
  type:
    | "text"
    | "textarea"
    | "richtext"
    | "url"
    | "number"
    | "select"
    | "json"
    | "media"
    | "media-multiple"
    | "collection"
    | "form";
  options?: Array<{ label: string; value: string }>;
  help?: string;
};
type BlockDefinition = {
  label: string;
  description: string;
  fields: readonly string[];
  editor: Record<string, EditorField>;
  schema: z.ZodType<Record<string, unknown>>;
  defaults: Record<string, unknown>;
};
const string = z.string().max(500).optional().default("");
const longText = z.string().max(50_000).optional().default("");
const url = z
  .string()
  .max(2_000)
  .refine(
    (value) => !value || value.startsWith("/") || /^https?:\/\//i.test(value),
    "Use an internal path or HTTP(S) URL",
  )
  .optional()
  .default("");
const image = z.object({
  url: z.string().url(),
  alt: z.string().max(300).optional(),
  caption: z.string().max(500).optional(),
});
const collectionFields = {
  contentType: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
    .default(""),
  filterField: z.string().max(64).optional().default(""),
  filterValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  sortField: z.string().max(64).optional().default(""),
  sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
  limit: z.coerce.number().int().min(1).max(24).optional().default(6),
  manualSelection: z.array(z.string()).max(24).optional().default([]),
};
const collectionEditor: Record<string, EditorField> = {
  contentType: { label: "Collection", type: "collection" },
  filterField: { label: "Filter field", type: "text" },
  filterValue: { label: "Filter value", type: "text" },
  sortField: { label: "Sort field", type: "text" },
  sortDirection: {
    label: "Sort direction",
    type: "select",
    options: [
      { label: "Descending", value: "desc" },
      { label: "Ascending", value: "asc" },
    ],
  },
  limit: { label: "Maximum items", type: "number" },
  manualSelection: {
    label: "Manual entry IDs",
    type: "json",
    help: "Optional JSON array of entry IDs",
  },
};
const define = <T extends BlockDefinition>(definition: T) => definition;

export const BLOCK_REGISTRY = {
  HERO: define({
    label: "Hero",
    description: "Large introductory banner",
    fields: [
      "title",
      "subtitle",
      "description",
      "backgroundImage",
      "primaryButtonLabel",
      "primaryButtonUrl",
      "alignment",
    ],
    editor: {
      title: { label: "Title", type: "text" },
      subtitle: { label: "Subtitle", type: "text" },
      description: { label: "Description", type: "textarea" },
      backgroundImage: { label: "Background image", type: "media" },
      primaryButtonLabel: { label: "Button label", type: "text" },
      primaryButtonUrl: { label: "Button URL", type: "url" },
      alignment: {
        label: "Alignment",
        type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
        ],
      },
    },
    schema: z.object({
      title: string,
      subtitle: string,
      description: longText,
      backgroundImage: url,
      primaryButtonLabel: string,
      primaryButtonUrl: url,
      alignment: z.enum(["left", "center"]).optional().default("center"),
    }),
    defaults: { alignment: "center" },
  }),
  RICH_TEXT: define({
    label: "Rich text",
    description: "Formatted editorial content",
    fields: ["html"],
    editor: { html: { label: "Content", type: "richtext" } },
    schema: z.object({ html: longText }),
    defaults: { html: "" },
  }),
  IMAGE: define({
    label: "Image",
    description: "Single image with caption",
    fields: ["url", "alt", "caption"],
    editor: {
      url: { label: "Image", type: "media" },
      alt: { label: "Alternative text", type: "text" },
      caption: { label: "Caption", type: "textarea" },
    },
    schema: z.object({ url, alt: string, caption: string }),
    defaults: {},
  }),
  IMAGE_GALLERY: define({
    label: "Image gallery",
    description: "Responsive image gallery",
    fields: ["title", "images"],
    editor: {
      title: { label: "Title", type: "text" },
      images: { label: "Images", type: "media-multiple" },
    },
    schema: z.object({ title: string, images: z.array(image).max(30).optional().default([]) }),
    defaults: { images: [] },
  }),
  EXPERIENCE_GRID: define({
    label: "Experience grid",
    description: "Cards powered by a CMS collection",
    fields: ["title", "description", ...Object.keys(collectionEditor)],
    editor: {
      title: { label: "Title", type: "text" },
      description: { label: "Description", type: "textarea" },
      ...collectionEditor,
    },
    schema: z.object({ title: string, description: longText, ...collectionFields }),
    defaults: { limit: 6, sortDirection: "desc", manualSelection: [] },
  }),
  ACCOMMODATION_GRID: define({
    label: "Accommodation grid",
    description: "Cards powered by a CMS collection",
    fields: ["title", "description", ...Object.keys(collectionEditor)],
    editor: {
      title: { label: "Title", type: "text" },
      description: { label: "Description", type: "textarea" },
      ...collectionEditor,
    },
    schema: z.object({ title: string, description: longText, ...collectionFields }),
    defaults: { limit: 6, sortDirection: "desc", manualSelection: [] },
  }),
  TOUR_GRID: define({
    label: "Tour grid",
    description: "Tour cards powered by a CMS collection",
    fields: ["title", "description", ...Object.keys(collectionEditor)],
    editor: {
      title: { label: "Title", type: "text" },
      description: { label: "Description", type: "textarea" },
      ...collectionEditor,
    },
    schema: z.object({ title: string, description: longText, ...collectionFields }),
    defaults: { limit: 6, sortDirection: "desc", manualSelection: [] },
  }),
  COLLECTION_LIST: define({
    label: "Collection list",
    description: "Generic filtered list of published entries",
    fields: ["title", "description", ...Object.keys(collectionEditor)],
    editor: {
      title: { label: "Title", type: "text" },
      description: { label: "Description", type: "textarea" },
      ...collectionEditor,
    },
    schema: z.object({ title: string, description: longText, ...collectionFields }),
    defaults: { limit: 6, sortDirection: "desc", manualSelection: [] },
  }),
  FAQ: define({
    label: "FAQ",
    description: "Expandable questions and answers",
    fields: ["title", "items"],
    editor: {
      title: { label: "Title", type: "text" },
      items: { label: "Questions", type: "json" },
    },
    schema: z.object({
      title: string,
      items: z
        .array(z.object({ question: z.string().max(500), answer: z.string().max(5_000) }))
        .max(40)
        .optional()
        .default([]),
    }),
    defaults: { items: [] },
  }),
  CTA: define({
    label: "Call to action",
    description: "Focused action banner",
    fields: ["title", "description", "buttonLabel", "buttonUrl"],
    editor: {
      title: { label: "Title", type: "text" },
      description: { label: "Description", type: "textarea" },
      buttonLabel: { label: "Button label", type: "text" },
      buttonUrl: { label: "Button URL", type: "url" },
    },
    schema: z.object({ title: string, description: longText, buttonLabel: string, buttonUrl: url }),
    defaults: {},
  }),
  STATS: define({
    label: "Statistics",
    description: "Key figures",
    fields: ["title", "items"],
    editor: {
      title: { label: "Title", type: "text" },
      items: { label: "Statistics", type: "json" },
    },
    schema: z.object({
      title: string,
      items: z
        .array(z.object({ value: z.union([z.string(), z.number()]), label: z.string().max(200) }))
        .max(12)
        .optional()
        .default([]),
    }),
    defaults: { items: [] },
  }),
  FEATURE_CARDS: define({
    label: "Feature cards",
    description: "Cards with title, description and optional image",
    fields: ["title", "items"],
    editor: { title: { label: "Title", type: "text" }, items: { label: "Cards", type: "json" } },
    schema: z.object({
      title: string,
      items: z
        .array(
          z.object({
            title: z.string().max(300),
            description: z.string().max(2_000).optional(),
            image: z.string().url().optional(),
            url,
          }),
        )
        .max(24)
        .optional()
        .default([]),
    }),
    defaults: { items: [] },
  }),
  VIDEO: define({
    label: "Video",
    description: "Embedded YouTube or Vimeo video",
    fields: ["title", "url", "caption"],
    editor: {
      title: { label: "Title", type: "text" },
      url: { label: "Video URL", type: "url" },
      caption: { label: "Caption", type: "textarea" },
    },
    schema: z.object({ title: string, url, caption: string }),
    defaults: {},
  }),
  MAP: define({
    label: "Map",
    description: "Map centered on coordinates",
    fields: ["title", "latitude", "longitude", "zoom"],
    editor: {
      title: { label: "Title", type: "text" },
      latitude: { label: "Latitude", type: "number" },
      longitude: { label: "Longitude", type: "number" },
      zoom: { label: "Zoom", type: "number" },
    },
    schema: z.object({
      title: string,
      latitude: z.coerce.number().min(-90).max(90),
      longitude: z.coerce.number().min(-180).max(180),
      zoom: z.coerce.number().int().min(1).max(20).optional().default(12),
    }),
    defaults: { latitude: 36.8065, longitude: 10.1815, zoom: 12 },
  }),
  FORM: define({
    label: "Form",
    description: "Published CMS form",
    fields: ["title", "description", "formSlug"],
    editor: {
      title: { label: "Title", type: "text" },
      description: { label: "Description", type: "textarea" },
      formSlug: { label: "Form", type: "form" },
    },
    schema: z.object({
      title: string,
      description: longText,
      formSlug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .optional()
        .default(""),
    }),
    defaults: {},
  }),
  CONTACT: define({
    label: "Contact",
    description: "Contact section with a published form",
    fields: ["title", "description", "formSlug"],
    editor: {
      title: { label: "Title", type: "text" },
      description: { label: "Description", type: "textarea" },
      formSlug: { label: "Form", type: "form" },
    },
    schema: z.object({
      title: string,
      description: longText,
      formSlug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .optional()
        .default(""),
    }),
    defaults: {},
  }),
  NEWSLETTER: define({
    label: "Newsletter",
    description: "Newsletter signup",
    fields: ["title", "description"],
    editor: {
      title: { label: "Title", type: "text" },
      description: { label: "Description", type: "textarea" },
    },
    schema: z.object({ title: string, description: longText }),
    defaults: {},
  }),
  REVIEW_LIST: define({
    label: "Reviews",
    description: "Published reviews from a CMS collection",
    fields: ["title", ...Object.keys(collectionEditor)],
    editor: { title: { label: "Title", type: "text" }, ...collectionEditor },
    schema: z.object({ title: string, ...collectionFields }),
    defaults: { limit: 6, sortDirection: "desc", manualSelection: [] },
  }),
  TESTIMONIAL_SLIDER: define({
    label: "Testimonials",
    description: "Published testimonials from a CMS collection",
    fields: ["title", ...Object.keys(collectionEditor)],
    editor: { title: { label: "Title", type: "text" }, ...collectionEditor },
    schema: z.object({ title: string, ...collectionFields }),
    defaults: { limit: 6, sortDirection: "desc", manualSelection: [] },
  }),
  COMMUNITY_FEED: define({
    label: "Community feed",
    description: "Published community items from a CMS collection",
    fields: ["title", ...Object.keys(collectionEditor)],
    editor: { title: { label: "Title", type: "text" }, ...collectionEditor },
    schema: z.object({ title: string, ...collectionFields }),
    defaults: { limit: 6, sortDirection: "desc", manualSelection: [] },
  }),
  RELATED_CONTENT: define({
    label: "Related content",
    description: "Curated or filtered collection entries",
    fields: ["title", ...Object.keys(collectionEditor)],
    editor: { title: { label: "Title", type: "text" }, ...collectionEditor },
    schema: z.object({ title: string, ...collectionFields }),
    defaults: { limit: 6, sortDirection: "desc", manualSelection: [] },
  }),
  BREADCRUMBS: define({
    label: "Breadcrumbs",
    description: "Navigation trail",
    fields: ["items"],
    editor: { items: { label: "Items", type: "json" } },
    schema: z.object({
      items: z
        .array(z.object({ label: z.string().max(200), url }))
        .max(12)
        .optional()
        .default([]),
    }),
    defaults: { items: [] },
  }),
} satisfies Record<string, BlockDefinition>;

export const REGISTERED_BLOCK_TYPES = Object.keys(BLOCK_REGISTRY) as [
  keyof typeof BLOCK_REGISTRY,
  ...(keyof typeof BLOCK_REGISTRY)[],
];
export type RegisteredBlockType = keyof typeof BLOCK_REGISTRY;
export function validateBlockData(type: RegisteredBlockType, data: Record<string, unknown>) {
  return BLOCK_REGISTRY[type].schema.safeParse(data);
}
