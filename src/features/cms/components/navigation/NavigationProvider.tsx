"use client";

import { createContext, useContext } from "react";
import type { NavigationLabel, PublicNavigationItem } from "@/features/cms/services/navigation";
import type { CalmaLang } from "@/lib/calma/i18n";

const NavigationContext = createContext<Record<string, PublicNavigationItem[]>>({});

export function NavigationProvider({
  navigations,
  children,
}: {
  navigations: Record<string, PublicNavigationItem[]>;
  children: React.ReactNode;
}) {
  return <NavigationContext.Provider value={navigations}>{children}</NavigationContext.Provider>;
}

export function usePublicNavigation(key: string) {
  return useContext(NavigationContext)[key] ?? [];
}

export function navigationLabel(label: NavigationLabel, locale: CalmaLang) {
  return label[locale] || label.fr || label.en || label.ar || "";
}
