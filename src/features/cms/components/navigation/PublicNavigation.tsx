"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useOptionalCalmaLang, type CalmaLang } from "@/lib/calma/i18n";
import { navigationLabel, usePublicNavigation } from "./NavigationProvider";
import type { PublicNavigationItem } from "@/features/cms/services/navigation";
import { NavMegaMenu } from "@/components/calma/NavMegaMenu";

const MEGA_MENU_HREFS: Record<string, "services" | "marketplace"> = {
  "/services": "services",
  "/marketplace": "marketplace",
};

function ExternalAwareLink({
  item,
  className,
  onClick,
  locale = "fr",
}: {
  item: PublicNavigationItem;
  className: string;
  onClick?: () => void;
  locale?: CalmaLang;
}) {
  const lang = useOptionalCalmaLang()?.lang ?? locale;
  if (!item.href) return <span className={className}>{navigationLabel(item.label, lang)}</span>;
  return (
    <Link
      href={item.href}
      target={item.target}
      rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
      className={className}
      onClick={onClick}
    >
      {navigationLabel(item.label, lang)}
    </Link>
  );
}

export function DesktopPublicNavigation({
  menuKey = "main",
  light = true,
  className,
  locale = "fr",
}: {
  menuKey?: string;
  /** true = Calma header (dark text on the white bar, mega-menus); false = legacy Navbar. */
  light?: boolean;
  className?: string;
  locale?: CalmaLang;
}) {
  const items = usePublicNavigation(menuKey);
  const pathname = usePathname();
  const lang = useOptionalCalmaLang()?.lang ?? locale;
  const navClassName = className ?? "hidden items-center gap-0.5 md:flex";
  const base = light
    ? "whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium 2xl:px-4 text-calma-ink/75 no-underline outline-none transition-colors hover:bg-calma-ink/[.05] hover:text-calma-ink focus-visible:ring-2 focus-visible:ring-calma-olive"
    : "whitespace-nowrap border-b-2 border-transparent px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-[#5e7480] outline-none transition-colors hover:border-[#D2B38B]/50 hover:text-[#15242e] focus-visible:ring-2 focus-visible:ring-[#D2B38B]";
  const active = light
    ? "bg-calma-ink/[.06] font-semibold text-calma-ink"
    : "border-[#D2B38B] text-[#15242e]";
  return (
    <nav aria-label="Main navigation" className={navClassName}>
      {items.map((item) => {
        const isActive =
          !!item.href &&
          (pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)));
        // "Services" and "Marketplace" get a real hover mega-menu (live services / product
        // categories) instead of a plain link — Calma-branded (light) nav only, so the
        // secondary English navbar and CMS-authored dropdown items are unaffected.
        const megaKind = light && item.href ? MEGA_MENU_HREFS[item.href] : undefined;
        if (megaKind)
          return (
            <NavMegaMenu
              key={item.id}
              href={item.href!}
              label={navigationLabel(item.label, lang)}
              kind={megaKind}
              baseClassName={base}
              isActive={isActive}
            />
          );
        if (!item.children.length)
          return (
            <ExternalAwareLink
              key={item.id}
              item={item}
              locale={locale}
              className={`${base} ${isActive ? active : ""}`}
            />
          );
        return (
          <DropdownMenu.Root key={item.id}>
            <DropdownMenu.Trigger
              className={`${base} flex items-center gap-1 ${isActive ? active : ""}`}
            >
              {navigationLabel(item.label, lang)} <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={10}
                className="z-[100] min-w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
              >
                {item.href && (
                  <DropdownMenu.Item asChild>
                    <ExternalAwareLink
                      item={item}
                      locale={locale}
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 outline-none hover:bg-slate-100 focus:bg-slate-100"
                    />
                  </DropdownMenu.Item>
                )}
                <DesktopChildren items={item.children} locale={locale} />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        );
      })}
    </nav>
  );
}

function DesktopChildren({
  items,
  depth = 0,
  locale = "fr",
}: {
  items: PublicNavigationItem[];
  depth?: number;
  locale?: CalmaLang;
}) {
  return items.map((item) => (
    <div key={item.id}>
      <DropdownMenu.Item asChild>
        <ExternalAwareLink
          item={item}
          locale={locale}
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100 focus:bg-slate-100"
        />
      </DropdownMenu.Item>
      {!!item.children.length && (
        <div className="border-l border-slate-200" style={{ marginLeft: 12 + depth * 8 }}>
          <DesktopChildren items={item.children} depth={depth + 1} locale={locale} />
        </div>
      )}
    </div>
  ));
}

export function MobilePublicNavigation({
  menuKey = "main",
  onNavigate,
  locale = "fr",
}: {
  menuKey?: string;
  onNavigate?: () => void;
  locale?: CalmaLang;
}) {
  const items = usePublicNavigation(menuKey);
  const pathname = usePathname();
  const lang = useOptionalCalmaLang()?.lang ?? locale;
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const render = (entries: PublicNavigationItem[], depth = 0): React.ReactNode =>
    entries.map((item) => {
      const isActive =
        !!item.href &&
        (pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)));
      return (
        <div key={item.id} style={{ marginLeft: depth * 14 }}>
          <div className="flex items-center">
            <ExternalAwareLink
              item={item}
              locale={locale}
              onClick={onNavigate}
              className={`flex-1 rounded-xl px-4 py-3 text-base no-underline outline-none focus-visible:ring-2 focus-visible:ring-calma-olive ${isActive ? "bg-calma-ink/[.06] font-semibold text-calma-ink" : "font-medium text-calma-ink/80 hover:bg-calma-ink/[.05]"}`}
            />
            {!!item.children.length && (
              <button
                type="button"
                aria-expanded={expanded.has(item.id)}
                aria-label={`Toggle ${navigationLabel(item.label, lang)} submenu`}
                onClick={() =>
                  setExpanded((current) => {
                    const next = new Set(current);
                    if (next.has(item.id)) next.delete(item.id);
                    else next.add(item.id);
                    return next;
                  })
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl text-calma-ink/60 hover:bg-calma-olive/10 focus-visible:ring-2 focus-visible:ring-calma-terracotta"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${expanded.has(item.id) ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>
          {expanded.has(item.id) && render(item.children, depth + 1)}
        </div>
      );
    });
  return (
    <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
      {render(items)}
    </nav>
  );
}

export function FooterPublicNavigation({
  menuKey,
  locale = "fr",
  linkClassName = "text-calma-cream/[.82] no-underline hover:text-calma-cream",
}: {
  menuKey: string;
  locale?: CalmaLang;
  /** Defaults to cream-on-dark (legacy footer); CalmaFooter passes dark-on-light. */
  linkClassName?: string;
}) {
  const items = usePublicNavigation(menuKey);
  const lang = useOptionalCalmaLang()?.lang ?? locale;
  const render = (entries: PublicNavigationItem[], depth = 0): React.ReactNode =>
    entries.map((item) => (
      <div key={item.id} style={{ marginLeft: depth * 12 }}>
        {item.href ? (
          <Link
            href={item.href}
            target={item.target}
            rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
            className={linkClassName}
          >
            {navigationLabel(item.label, lang)}
          </Link>
        ) : (
          <span className={`font-semibold ${linkClassName}`}>
            {navigationLabel(item.label, lang)}
          </span>
        )}
        {!!item.children.length && (
          <div className="mt-2 flex flex-col gap-2">{render(item.children, depth + 1)}</div>
        )}
      </div>
    ));
  return (
    <nav aria-label={menuKey} className="flex flex-col gap-2.5 text-sm">
      {render(items)}
    </nav>
  );
}
