"use client";
import React, { useState } from "react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useSession, signOut } from "next-auth/react";
import {
  Briefcase,
  Check,
  ChevronDown,
  Globe,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useCalmaLang, type CalmaLang, type CalmaLayoutDict } from "@/lib/calma/i18n";
import { isAdminWorkspaceRole } from "@/lib/access";
import { useSiteSettings } from "@/features/cms/components/settings/SiteSettingsProvider";
import { CalmaLogoOrCustom } from "@/components/calma/CalmaLogo";
import {
  DesktopPublicNavigation,
  MobilePublicNavigation,
} from "@/features/cms/components/navigation/PublicNavigation";

export type CalmaActiveNav =
  "home" | "services" | "marketplace" | "explore" | "blog" | "community" | "about";

interface CalmaHeaderProps {
  /** Kept for call sites; the highlighted tab is derived from the URL in PublicNavigation. */
  active: CalmaActiveNav | "contact" | "dashboard";
}

const LANGS: { code: CalmaLang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

function spaceHomeFor(role: string | null | undefined, l: CalmaLayoutDict) {
  if (isAdminWorkspaceRole(role)) return { href: "/admin", label: l.adminSpace };
  if (role === "B2B") return { href: "/b2b", label: l.partnerSpace };
  return { href: "/dashboard", label: l.mySpace };
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const menuItemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-calma-ink no-underline outline-none transition-colors hover:bg-calma-ink/[.05] focus:bg-calma-ink/[.05]";
const menuContentClass =
  "z-50 min-w-[200px] rounded-xl border border-calma-ink/10 bg-white p-1.5 font-hanken shadow-[0_16px_40px_-12px_rgba(21,36,46,.25)]";
const drawerLinkClass =
  "flex items-center gap-2.5 rounded-xl px-4 py-3 text-start text-base font-medium text-calma-ink no-underline transition-colors hover:bg-calma-ink/[.05]";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CalmaHeader(_props: CalmaHeaderProps) {
  const { lang, setLang, t, dir } = useCalmaLang();
  const l = t.layout;
  const { data: session, status } = useSession();
  const settings = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = status === "authenticated" ? session?.user : null;
  const space = user ? spaceHomeFor(user.role, l) : null;

  return (
    <DirectionProvider dir={dir}>
      <header className="sticky top-0 z-40 border-b border-calma-ink/10 bg-white font-hanken">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center no-underline">
            <CalmaLogoOrCustom
              customUrl={settings?.branding.logoUrl}
              alt={settings?.general.siteName ?? "Calma Trip"}
              tone="navy"
              imgClassName="h-10 w-auto"
              iconSize={38}
              textSize={19}
            />
          </Link>

          <DesktopPublicNavigation className="ms-10 hidden items-center gap-1 xl:flex 2xl:ms-14 2xl:gap-2" />

          <div className="ms-auto flex shrink-0 items-center gap-2 ps-6 lg:gap-3 xl:ps-10">
            <Link
              href="/partner"
              className="hidden items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[14px] font-semibold text-calma-ink no-underline transition-colors hover:bg-calma-ink/[.05] min-[1700px]:inline-flex"
            >
              <Briefcase size={16} />
              {t.navBecomePartner}
            </Link>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  aria-label={l.language}
                  className="hidden items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[14px] font-semibold text-calma-ink transition-colors hover:bg-calma-ink/[.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-calma-olive md:inline-flex"
                >
                  <Globe size={17} />
                  {lang.toUpperCase()}
                  <ChevronDown size={14} className="text-calma-taupe" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" sideOffset={8} className={menuContentClass}>
                  {LANGS.map(({ code, label }) => (
                    <DropdownMenu.Item key={code} asChild>
                      <button type="button" onClick={() => setLang(code)} className={menuItemClass}>
                        <span className="flex-1">{label}</span>
                        {lang === code && <Check size={15} className="text-calma-olive" />}
                      </button>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <span aria-hidden="true" className="hidden h-6 w-px bg-calma-ink/15 md:block" />

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                {user?.name ? (
                  <button
                    type="button"
                    aria-label={l.account}
                    className="hidden h-9 w-9 items-center justify-center rounded-full bg-calma-ink text-[12px] font-bold text-white transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-calma-olive focus-visible:ring-offset-2 sm:flex"
                  >
                    {initials(user.name)}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-calma-ink/20 px-4 py-2 text-[14px] font-semibold text-calma-ink transition-colors hover:border-calma-ink/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-calma-olive sm:inline-flex"
                  >
                    <User size={16} />
                    {l.login}
                  </button>
                )}
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" sideOffset={8} className={menuContentClass}>
                  {user && space ? (
                    <>
                      <div className="px-3 py-2.5">
                        <p className="truncate text-sm font-semibold text-calma-ink">{user.name}</p>
                        <p className="truncate text-xs text-calma-taupe">{user.email}</p>
                      </div>
                      <div className="my-1 h-px bg-calma-ink/10" />
                      <DropdownMenu.Item asChild>
                        <Link href={space.href} className={menuItemClass}>
                          <LayoutDashboard size={16} className="text-calma-olive" />
                          {space.label}
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <button
                          type="button"
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className={menuItemClass}
                        >
                          <LogOut size={16} className="text-calma-olive" />
                          {l.logout}
                        </button>
                      </DropdownMenu.Item>
                    </>
                  ) : (
                    <>
                      <DropdownMenu.Item asChild>
                        <Link href="/login" className={menuItemClass}>
                          <LogIn size={16} className="text-calma-olive" />
                          {l.login}
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link href="/register" className={menuItemClass}>
                          <UserPlus size={16} className="text-calma-olive" />
                          {l.register}
                        </Link>
                      </DropdownMenu.Item>
                    </>
                  )}
                  {/* The standalone partner link only shows from 1700px — below that it lives here. */}
                  <div className="my-1 h-px bg-calma-ink/10 min-[1700px]:hidden" />
                  <DropdownMenu.Item asChild>
                    <Link href="/partner" className={`${menuItemClass} min-[1700px]:hidden`}>
                      <Briefcase size={16} className="text-calma-olive" />
                      {t.navBecomePartner}
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label={l.openMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-calma-ink transition-colors hover:bg-calma-ink/[.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-calma-olive xl:hidden"
                >
                  <Menu size={22} />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-calma-ink/40 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
                <Dialog.Content
                  dir={dir}
                  className="fixed inset-y-0 end-0 z-50 flex h-full w-[85vw] max-w-sm flex-col overflow-y-auto bg-white p-5 font-hanken shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right rtl:data-[state=open]:slide-in-from-left rtl:data-[state=closed]:slide-out-to-left"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Dialog.Title className="text-lg font-bold text-calma-ink">
                      {l.menu}
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label={l.closeMenu}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-calma-ink/70 transition-colors hover:bg-calma-ink/[.05] hover:text-calma-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-calma-olive"
                      >
                        <X size={20} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <MobilePublicNavigation onNavigate={() => setMobileOpen(false)} />

                  <div className="my-4 h-px bg-calma-ink/10" />

                  {user && space ? (
                    <div className="flex flex-col gap-1">
                      <div className="px-4 py-2">
                        <p className="truncate text-sm font-semibold text-calma-ink">{user.name}</p>
                        <p className="truncate text-xs text-calma-taupe">{user.email}</p>
                      </div>
                      <Link
                        href={space.href}
                        onClick={() => setMobileOpen(false)}
                        className={drawerLinkClass}
                      >
                        <LayoutDashboard size={18} className="text-calma-olive" />
                        {space.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className={drawerLinkClass}
                      >
                        <LogOut size={18} className="text-calma-olive" />
                        {l.logout}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className={drawerLinkClass}
                      >
                        <LogIn size={18} className="text-calma-olive" />
                        {l.login}
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className={drawerLinkClass}
                      >
                        <UserPlus size={18} className="text-calma-olive" />
                        {l.register}
                      </Link>
                    </div>
                  )}

                  <Link
                    href="/partner"
                    onClick={() => setMobileOpen(false)}
                    className={`${drawerLinkClass} mt-1`}
                  >
                    <Briefcase size={18} className="text-calma-olive" />
                    {t.navBecomePartner}
                  </Link>

                  <div className="my-4 h-px bg-calma-ink/10" />

                  <div className="px-4 pb-2 text-[13px] font-semibold text-calma-taupe">
                    {l.language}
                  </div>
                  <div className="flex gap-2 px-4">
                    {LANGS.map(({ code, label }) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setLang(code)}
                        aria-pressed={lang === code}
                        className={`rounded-full border px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                          lang === code
                            ? "border-calma-ink bg-calma-ink text-white"
                            : "border-calma-ink/20 text-calma-ink hover:border-calma-ink/50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>
    </DirectionProvider>
  );
}
