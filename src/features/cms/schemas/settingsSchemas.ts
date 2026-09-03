import { z } from "zod";

// Site Settings — five structured categories backed by the existing
// `SiteSetting` key/value table (one row per category, key = category name).
// Deliberately NOT a generic key/anything editor: each category has its own
// schema below, and the admin UI only ever exposes these known fields.

const DANGEROUS_URL_PROTOCOLS = /^\s*(javascript|data|vbscript):/i;

/** https(s) URL only — rejects javascript:/data:/vbscript: and any other scheme. */
const safeHttpUrl = z
  .string()
  .trim()
  .max(500, "URL is too long")
  .refine((value) => !DANGEROUS_URL_PROTOCOLS.test(value), "Unsafe URL scheme")
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Must be a valid http(s) URL");

/** Optional variant: empty string / null / undefined all mean "not set". */
const optionalSafeHttpUrl = z
  .union([safeHttpUrl, z.literal(""), z.null(), z.undefined()])
  .transform((value) => (value ? value : null));

const optionalText = (max: number) =>
  z
    .union([z.string().trim().max(max), z.literal(""), z.null(), z.undefined()])
    .transform((value) => (value ? value : null));

// Loose international phone check — digits, spaces, +, -, () only. Deliberately
// permissive (no strict E.164 enforcement) so real, legitimate numbers already
// used by the business are never rejected.
const optionalPhone = z
  .union([z.string().trim().max(40), z.literal(""), z.null(), z.undefined()])
  .transform((value) => (value ? value : null))
  .refine(
    (value) => value === null || /^[+\d][\d\s().-]{4,39}$/.test(value),
    "Must be a valid phone number",
  );

const optionalEmail = z
  .union([z.string().trim().email().max(200), z.literal(""), z.null(), z.undefined()])
  .transform((value) => (value ? value : null));

export const CALMA_LOCALES = ["fr", "en", "ar"] as const;

export const generalSettingsSchema = z.object({
  siteName: z.string().trim().min(1, "Site name is required").max(120),
  siteDescription: z.string().trim().min(1, "Site description is required").max(300),
  defaultLocale: z.enum(CALMA_LOCALES),
  timezone: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .refine((value) => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: value });
        return true;
      } catch {
        return false;
      }
    }, "Must be a valid IANA timezone"),
});
export type GeneralSettings = z.infer<typeof generalSettingsSchema>;

// Logo/favicon are plain same-origin media URLs (matching how every other
// image field in this app — Product.image, ExploreListing.image, etc. —
// stores a URL rather than a media foreign key). Safe-deletion is already
// covered by the existing usage-scanner (mediaUsage.ts scans SiteSetting.value).
// Accepts either a same-origin path (a Media Library asset) or a safe
// http(s) URL. Null/empty means "use the built-in CalmaLogo brand mark".
const optionalBrandingAsset = z
  .union([z.string().trim().max(500), z.literal(""), z.null(), z.undefined()])
  .transform((value) => (value ? value : null))
  .refine((value) => {
    if (value === null) return true;
    if (value.startsWith("/")) return true;
    return !DANGEROUS_URL_PROTOCOLS.test(value) && /^https?:\/\//i.test(value);
  }, "Must reference a Media Library asset or a valid http(s) URL");

export const brandingSettingsSchema = z.object({
  logoUrl: optionalBrandingAsset,
  faviconUrl: optionalBrandingAsset,
});
export type BrandingSettings = z.infer<typeof brandingSettingsSchema>;

export const contactSettingsSchema = z.object({
  email: optionalEmail,
  phone: optionalPhone,
  whatsapp: optionalPhone,
  address: optionalText(300),
});
export type ContactSettings = z.infer<typeof contactSettingsSchema>;

export const socialSettingsSchema = z.object({
  facebook: optionalSafeHttpUrl,
  instagram: optionalSafeHttpUrl,
  tiktok: optionalSafeHttpUrl,
  youtube: optionalSafeHttpUrl,
});
export type SocialSettings = z.infer<typeof socialSettingsSchema>;

export const footerSettingsSchema = z.object({
  copyrightText: optionalText(200),
  description: optionalText(300),
});
export type FooterSettings = z.infer<typeof footerSettingsSchema>;

export const SETTINGS_GROUPS = ["general", "branding", "contact", "social", "footer"] as const;
export type SettingsGroup = (typeof SETTINGS_GROUPS)[number];

export const settingsSchemaByGroup = {
  general: generalSettingsSchema,
  branding: brandingSettingsSchema,
  contact: contactSettingsSchema,
  social: socialSettingsSchema,
  footer: footerSettingsSchema,
} satisfies Record<SettingsGroup, z.ZodTypeAny>;

export function isSettingsGroup(value: unknown): value is SettingsGroup {
  return typeof value === "string" && (SETTINGS_GROUPS as readonly string[]).includes(value);
}
