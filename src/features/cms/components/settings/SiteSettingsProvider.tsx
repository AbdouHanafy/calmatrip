"use client";

import { createContext, useContext } from "react";
import type { SiteSettings } from "@/features/cms/services/settings";

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

// Public client components (CalmaFooter, etc.) read settings resolved once,
// server-side, in the root layout — never fetch them again in the browser.
export function useSiteSettings(): SiteSettings | null {
  return useContext(SiteSettingsContext);
}
