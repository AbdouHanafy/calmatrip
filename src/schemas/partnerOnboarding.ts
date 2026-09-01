import { z } from "zod";
import {
  PARTNER_TYPES,
  SOCIAL_PLATFORMS,
  ARTISAN_INTEREST_CATEGORIES,
  AGENCY_INTEREST_CATEGORIES,
} from "@/lib/partners/constants";
import { COUNTRY_CODES, CURRENCY_CODES } from "@/lib/partners/geo";

const urlSchema = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .refine(
    (v) => {
      try {
        const u = new URL(v);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Please enter a valid URL (starting with https://)." },
  );

// PATCH /api/b2b/onboarding — every field optional so each step can save
// incrementally; whichever fields are present are validated and persisted.
export const partnerOnboardingPatchSchema = z.object({
  partnerType: z.enum(PARTNER_TYPES).optional(),
  currentStep: z.number().int().min(1).max(6).optional(),

  organizationName: z.string().trim().min(2).max(150).optional(),
  contactFirstName: z.string().trim().min(1).max(80).optional(),
  contactLastName: z.string().trim().min(1).max(80).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{6,20}$/, "Please enter a valid phone number.")
    .optional(),
  countryCode: z.enum(COUNTRY_CODES as [string, ...string[]]).optional(),
  city: z.string().trim().min(1).max(100).optional(),
  currency: z.enum(CURRENCY_CODES as [string, ...string[]]).optional(),
  website: z.union([urlSchema, z.literal("")]).optional(),

  interests: z.array(z.string().trim().min(1).max(60)).max(20).optional(),

  socialProfiles: z
    .array(
      z.object({
        platform: z.enum(SOCIAL_PLATFORMS),
        url: urlSchema,
      }),
    )
    .max(SOCIAL_PLATFORMS.length)
    .optional()
    .refine(
      (profiles) => !profiles || new Set(profiles.map((p) => p.platform)).size === profiles.length,
      { message: "Each platform can only be added once." },
    ),
});

export type PartnerOnboardingPatchInput = z.infer<typeof partnerOnboardingPatchSchema>;

const ALL_CATEGORIES = new Set([...ARTISAN_INTEREST_CATEGORIES, ...AGENCY_INTEREST_CATEGORIES]);

/**
 * Cross-field check the base schema can't express: interests must be valid
 * for the profile's OWN partner type (never trust the client to keep these
 * consistent — an AGENCY category submitted for an ARTISAN profile, etc.).
 */
export function validateInterestsForType(
  partnerType: "ARTISAN" | "AGENCY",
  interests: string[],
): string | null {
  const allowed: readonly string[] =
    partnerType === "ARTISAN" ? ARTISAN_INTEREST_CATEGORIES : AGENCY_INTEREST_CATEGORIES;
  for (const c of interests) {
    if (!ALL_CATEGORIES.has(c) || !allowed.includes(c)) {
      return `"${c}" is not a valid category for this partner type.`;
    }
  }
  return null;
}
