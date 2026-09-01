// Central configuration for the B2B partner onboarding wizard — the single
// source of truth for values that must otherwise never be hardcoded inside
// a component or duplicated between client and server validation.
import { AGENCY_EXPLORE_CATEGORIES } from "@/lib/explore/places";

export const PARTNER_TYPES = ["ARTISAN", "AGENCY"] as const;
export type PartnerType = (typeof PARTNER_TYPES)[number];

export const PARTNER_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
] as const;
export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

// Real Service.category values (confirmed against the live database) —
// what an ARTISAN can already work with on CalmaTrip.
export const ARTISAN_INTEREST_CATEGORIES = ["Transport", "Excursion", "Activity"] as const;

// Real AGENCY_EXPLORE_CATEGORIES, already used for Explore listing
// submissions — what an AGENCY can promote/sell on CalmaTrip.
export const AGENCY_INTEREST_CATEGORIES = AGENCY_EXPLORE_CATEGORIES;

export function interestCategoriesFor(partnerType: PartnerType): readonly string[] {
  return partnerType === "ARTISAN" ? ARTISAN_INTEREST_CATEGORIES : AGENCY_INTEREST_CATEGORIES;
}

export const SOCIAL_PLATFORMS = [
  "WEBSITE",
  "INSTAGRAM",
  "FACEBOOK",
  "TIKTOK",
  "YOUTUBE",
  "LINKEDIN",
  "OTHER",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const TOTAL_STEPS = 6;

// Statuses in which the wizard is locked (the application is out of the
// applicant's hands) — normal step editing must not be allowed.
export const LOCKED_STATUSES: PartnerStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
];
