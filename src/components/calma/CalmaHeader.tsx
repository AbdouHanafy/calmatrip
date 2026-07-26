"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { useSession, signOut } from "next-auth/react";
import {
  ArrowRight,
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

export type CalmaActiveNav = "home" | "services" | "marketplace" | "explore" | "about";

interface CalmaHeaderProps {
  /** 'contact'/'dashboard' (or any value outside the 5 nav tabs) leaves every tab unhighlighted — these aren't public nav tabs. */
  active: CalmaActiveNav | "contact" | "dashboard";
  /** overlay = transparent/glass, sits on top of the home hero photo. solid = plain olive bar for secondary pages. */
  variant?: "overlay" | "solid";
  /** Shifts the fixed overlay header down to make room for CalmaPromoTicker above it. */
  withTicker?: boolean;
}

function spaceHomeFor(role?: string | null): { href: string; label: string } {
  if (role === "ADMIN") return { href: "/admin", label: "Espace admin" };
  if (role === "B2B") return { href: "/b2b", label: "Espace partenaire" };
  return { href: "/dashboard", label: "Mon espace" };
}

export default function CalmaHeader({
  active,
  variant = "solid",
  withTicker = false,
}: CalmaHeaderProps) {
  const { lang, setLang, t } = useCalmaLang();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (variant !== "overlay") return;
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const navItems: { key: CalmaActiveNav; href: string; label: string }[] = [
    { key: "home", href: "/", label: t.navHome },
    { key: "services", href: "/services", label: t.navServices },
    { key: "marketplace", href: "/marketplace", label: t.navMarket },
    { key: "explore", href: "/explore", label: t.navExplore },
    { key: "about", href: "/about", label: t.navAbout },
  ];

  return (
    <header
      className={`flex items-center justify-between px-6 py-1 font-hanken transition-all duration-500 sm:px-10 ${
        variant === "overlay"
          ? `fixed inset-x-0 z-30 border-b ${withTicker ? "top-9" : "top-0"} ${
              scrolled
                ? "border-white/[.12] bg-calma-olive-deep/70 shadow-[0_8px_32px_-16px_rgba(0,0,0,.4)] backdrop-blur-xl"
                : "border-white/[.08] bg-white/[.05] backdrop-blur-md"
            }`
          : "relative z-20 bg-calma-olive"
      }`}
    >
      <Link
        href="/"
        className="flex flex-shrink-0 items-center transition-opacity hover:opacity-90"
      >
        <Image
          src="/images/logo-cream.png"
          alt="Calma Trip"
          width={252}
          height={78}
          className="h-8 w-auto sm:h-10"
          priority
        />
      </Link>

      <nav className="hidden gap-1 text-sm font-medium text-white md:flex">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={
              active === item.key
                ? "rounded-full bg-white/[.12] px-4 py-2 font-semibold text-white no-underline transition-all"
                : "rounded-full px-4 py-2 text-white/75 no-underline transition-all hover:bg-white/[.06] hover:text-white"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-2 rounded-full border border-white/[.14] bg-white/[.06] p-1.5 backdrop-blur-md md:flex">
        <div className="flex overflow-hidden rounded-full border border-white/25 text-[12px] font-semibold">
          {(["fr", "en", "ar"] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`px-3 py-1.5 transition-colors duration-200 ${
                lang === code
                  ? "bg-white/20 text-white"
                  : "bg-transparent text-white/65 hover:text-white/90"
              }`}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <Link
          href="/partner/register"
          className="hidden items-center gap-1.5 rounded-full border border-white/25 px-4 py-2.5 font-hanken text-[13px] font-semibold text-white/90 no-underline transition-all duration-200 hover:border-white/45 hover:bg-white/10 hover:text-white md:inline-flex"
        >
          <Briefcase size={14} />
          Devenir partenaire
        </Link>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-1.5 rounded-full px-[18px] py-2.5 font-hanken text-[13.5px] font-semibold text-white no-underline shadow-[0_8px_20px_-6px_rgba(242,153,74,.7)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_12px_24px_-6px_rgba(242,153,74,.85)] active:translate-y-0"
          style={{ background: "linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)" }}
        >
          {t.navContact}
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              aria-label="Compte"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/85 transition-all duration-200 hover:scale-105 hover:border-white/50 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:flex"
            >
              {status === "authenticated" && session?.user?.name ? (
                <span className="text-[11px] font-bold">
                  {session.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              ) : (
                <User size={16} />
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={12}
              className="z-50 min-w-[200px] rounded-2xl border border-calma-olive/10 bg-calma-cream p-1.5 font-hanken shadow-[0_22px_50px_-22px_rgba(42,38,34,.5)]"
            >
              {status === "authenticated" && session?.user ? (
                <>
                  <div className="px-3 py-2.5">
                    <p className="truncate text-sm font-semibold text-calma-ink">
                      {session.user.name}
                    </p>
                    <p className="truncate text-xs text-calma-taupe">{session.user.email}</p>
                  </div>
                  <div className="my-1 h-px bg-calma-border" />
                  <DropdownMenu.Item asChild>
                    <Link
                      href={spaceHomeFor(session.user.role).href}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-calma-ink no-underline outline-none transition-colors hover:bg-calma-terracotta/10 focus:bg-calma-terracotta/10"
                    >
                      <LayoutDashboard size={16} className="text-calma-terracotta" />
                      {spaceHomeFor(session.user.role).label}
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-calma-ink outline-none transition-colors hover:bg-calma-terracotta/10 focus:bg-calma-terracotta/10"
                    >
                      <LogOut size={16} className="text-calma-terracotta" />
                      Déconnexion
                    </button>
                  </DropdownMenu.Item>
                </>
              ) : (
                <>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/login"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-calma-ink no-underline outline-none transition-colors hover:bg-calma-terracotta/10 focus:bg-calma-terracotta/10"
                    >
                      <LogIn size={16} className="text-calma-terracotta" />
                      Connexion
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/register"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-calma-ink no-underline outline-none transition-colors hover:bg-calma-terracotta/10 focus:bg-calma-terracotta/10"
                    >
                      <UserPlus size={16} className="text-calma-terracotta" />
                      Inscription
                    </Link>
                  </DropdownMenu.Item>
                  <div className="my-1 h-px bg-calma-border md:hidden" />
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/partner/register"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-calma-ink no-underline outline-none transition-colors hover:bg-calma-terracotta/10 focus:bg-calma-terracotta/10 md:hidden"
                    >
                      <Briefcase size={16} className="text-calma-terracotta" />
                      Devenir partenaire
                    </Link>
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/90 transition-all duration-200 hover:border-white/45 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:hidden"
          >
            <Menu size={20} />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-calma-ink/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-[85vw] max-w-sm flex-col overflow-y-auto bg-calma-cream p-6 font-hanken shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
            <div className="mb-6 flex items-center justify-between">
              <Dialog.Title className="font-fraunces text-lg font-semibold text-calma-ink">
                Menu
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Fermer le menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-calma-ink/70 transition-colors hover:bg-calma-olive/10 hover:text-calma-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-calma-terracotta"
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={
                    active === item.key
                      ? "rounded-xl bg-calma-terracotta/10 px-4 py-3 text-base font-semibold text-calma-ink no-underline"
                      : "rounded-xl px-4 py-3 text-base font-medium text-calma-ink/80 no-underline transition-colors hover:bg-calma-olive/10"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="my-4 h-px bg-calma-border" />

            <div className="flex overflow-hidden self-start rounded-full border border-calma-border text-[12px] font-semibold">
              {(["fr", "en", "ar"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-3 py-2 transition-colors duration-200 ${
                    lang === code
                      ? "bg-calma-olive text-white"
                      : "bg-transparent text-calma-ink/70 hover:bg-calma-olive/10"
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="my-4 h-px bg-calma-border" />

            {status === "authenticated" && session?.user ? (
              <div className="flex flex-col gap-1">
                <div className="px-4 py-2">
                  <p className="truncate text-sm font-semibold text-calma-ink">
                    {session.user.name}
                  </p>
                  <p className="truncate text-xs text-calma-taupe">{session.user.email}</p>
                </div>
                <Link
                  href={spaceHomeFor(session.user.role).href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-calma-ink no-underline transition-colors hover:bg-calma-olive/10"
                >
                  <LayoutDashboard size={18} className="text-calma-terracotta" />
                  {spaceHomeFor(session.user.role).label}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-left text-base font-medium text-calma-ink transition-colors hover:bg-calma-olive/10"
                >
                  <LogOut size={18} className="text-calma-terracotta" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-calma-ink no-underline transition-colors hover:bg-calma-olive/10"
                >
                  <LogIn size={18} className="text-calma-terracotta" />
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-calma-ink no-underline transition-colors hover:bg-calma-olive/10"
                >
                  <UserPlus size={18} className="text-calma-terracotta" />
                  Inscription
                </Link>
              </div>
            )}

            <div className="my-4 h-px bg-calma-border" />

            <Link
              href="/partner/register"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-calma-ink no-underline transition-colors hover:bg-calma-olive/10"
            >
              <Briefcase size={18} className="text-calma-terracotta" />
              Devenir partenaire
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-base font-semibold text-white no-underline shadow-[0_8px_20px_-6px_rgba(242,153,74,.7)]"
              style={{ background: "linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)" }}
            >
              {t.navContact}
              <ArrowRight size={16} />
            </Link>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
