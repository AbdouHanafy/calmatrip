import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  SETTINGS_GROUPS,
  settingsSchemaByGroup,
  type SettingsGroup,
  type GeneralSettings,
  type BrandingSettings,
  type ContactSettings,
  type SocialSettings,
  type FooterSettings,
} from "../schemas/settingsSchemas";

export type SiteSettings = {
  general: GeneralSettings;
  branding: BrandingSettings;
  contact: ContactSettings;
  social: SocialSettings;
  footer: FooterSettings;
};

// Real values already in production use (site metadata, contact cards, the
// WhatsApp widget, organizationSchema's sameAs) — NOT placeholders. These are
// the fallback whenever a category has never been saved through the admin UI,
// so the public site renders identically to today until an administrator
// actually changes something.
const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    siteName: "Calma Trip",
    siteDescription:
      "Calma Trip is Tunisia's stress-free travel hub. Private transfers, camel treks, catamaran trips, 4x4 tours, cultural excursions — booked once, perfectly delivered. Local prices. 24/7 multilingual support.",
    defaultLocale: "fr",
    timezone: "Africa/Tunis",
  },
  branding: {
    logoUrl: "/images/logo-cream.png",
    faviconUrl: "/icons/favicon.svg",
  },
  contact: {
    email: "contact@calmatrip.com",
    phone: "+216 21 622 972",
    whatsapp: "+216 21 622 972",
    address: "Avenue Habib Bourguiba, Hammamet, Tunisie",
  },
  social: {
    facebook: "https://www.facebook.com/calmatrip",
    instagram: "https://www.instagram.com/calmatrip",
    tiktok: "https://www.tiktok.com/@calmatrip",
    youtube: null,
  },
  footer: {
    copyrightText: "Calma Trip · Tunisie",
    description: null,
  },
};

function mergeGroup<G extends SettingsGroup>(group: G, storedValue: unknown): SiteSettings[G] {
  const fallback = DEFAULT_SETTINGS[group];
  if (storedValue === null || storedValue === undefined || typeof storedValue !== "object")
    return fallback;
  const merged = { ...fallback, ...(storedValue as Record<string, unknown>) };
  const parsed = settingsSchemaByGroup[group].safeParse(merged);
  // A malformed stored value (e.g. from a bug or manual DB edit) must never
  // crash the public site — fall back to defaults rather than throwing.
  return parsed.success ? (parsed.data as SiteSettings[G]) : fallback;
}

export async function loadSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: [...SETTINGS_GROUPS] } },
  });
  const byKey = new Map(rows.map((row) => [row.key, row.value]));
  return {
    general: mergeGroup("general", byKey.get("general")),
    branding: mergeGroup("branding", byKey.get("branding")),
    contact: mergeGroup("contact", byKey.get("contact")),
    social: mergeGroup("social", byKey.get("social")),
    footer: mergeGroup("footer", byKey.get("footer")),
  };
}

// Public site consumers must call this cached version (one DB round trip,
// shared across the whole request tree, invalidated via revalidateTag on
// save — same pattern as getPublishedNavigations in navigation.ts).
export const getSiteSettings = unstable_cache(loadSiteSettings, ["site-settings"], {
  tags: ["site-settings"],
});

// Admin UI reads the live, uncached value so a save is reflected immediately
// even before revalidation propagates.
export async function getSiteSettingsUncached(): Promise<SiteSettings> {
  return loadSiteSettings();
}
