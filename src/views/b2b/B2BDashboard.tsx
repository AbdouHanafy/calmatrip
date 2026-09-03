"use client";
import Link from "next/link";
import CalmaLogo from "@/components/calma/CalmaLogo";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  UserCog,
  Compass,
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
} from "lucide-react";
import { useState } from "react";
import NotificationBell from "@/components/ui/NotificationBell";
import B2BOverview from "./B2BOverview";

const STATUS_BADGE: Record<
  string,
  { label: string; icon: typeof Clock; onDark: string; onLight: string }
> = {
  pending: {
    label: "En attente",
    icon: Clock,
    onDark: "bg-amber-400/15 text-amber-300",
    onLight: "border border-amber-200 bg-amber-50 text-amber-700",
  },
  approved: {
    label: "Approuvé",
    icon: CheckCircle2,
    onDark: "bg-calma-success/15 text-calma-success",
    onLight: "bg-calma-success/10 text-calma-success",
  },
  rejected: {
    label: "Refusé",
    icon: XCircle,
    onDark: "bg-red-500/15 text-red-400",
    onLight: "bg-red-50 text-red-600",
  },
  suspended: {
    label: "Suspendu",
    icon: PauseCircle,
    onDark: "bg-red-500/15 text-red-400",
    onLight: "bg-red-50 text-red-600",
  },
};

export default function B2BDashboard({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  // Defensive: normalize casing — some historical accounts stored the value
  // lowercase, which silently hid every type-specific nav item below.
  const b2bType = session?.user?.b2bType?.toUpperCase() as "ARTISAN" | "AGENCY" | undefined;
  const b2bStatus = (session?.user?.b2bStatus ?? "pending").toLowerCase();
  const isApproved = b2bStatus === "approved";
  const isArtisan = b2bType === "ARTISAN";
  const isAgency = b2bType === "AGENCY";
  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "B2";

  const typeLabel = isArtisan ? "Artisan" : isAgency ? "Agence" : "Partenaire";
  const TypeIcon = isArtisan ? Store : Compass;
  const status = STATUS_BADGE[b2bStatus] ?? STATUS_BADGE.pending;
  const StatusIcon = status.icon;

  const navItems = [
    { path: "/b2b", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
    ...(isApproved && isArtisan
      ? [
          { path: "/b2b/products", label: "Mes produits", icon: Package },
          { path: "/b2b/services", label: "Mes services", icon: Compass },
        ]
      : []),
    ...(isApproved && isAgency
      ? [{ path: "/b2b/explore", label: "Mes annonces Explore", icon: MapPin }]
      : []),
    ...(isApproved && !isAgency
      ? [
          {
            path: "/b2b/sales",
            label: "Ventes",
            icon: TrendingUp,
          },
        ]
      : []),
    { path: "/b2b/profile", label: "Mon profil", icon: UserCog },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return pathname === path;
    return pathname?.startsWith(path);
  };
  const pageTitle =
    pathname === "/b2b/products"
      ? "Mes produits"
      : pathname === "/b2b/services"
        ? "Mes services"
        : pathname === "/b2b/explore"
          ? "Mes annonces"
          : pathname === "/b2b/sales"
            ? "Ventes et revenus"
            : pathname === "/b2b/profile"
              ? "Profil partenaire"
              : isArtisan
                ? "Tableau de bord artisan"
                : isAgency
                  ? "Tableau de bord agence"
                  : "Espace partenaire";
  const pageDescription =
    pathname === "/b2b"
      ? isApproved
        ? "Pilotez votre activité CalmaTrip"
        : "Suivez la validation de votre candidature"
      : "Gérez votre activité et son statut de publication";

  return (
    <div className="partner-workspace min-h-screen font-hanken flex text-calma-ink">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm lg:hidden"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 text-calma-terracotta" />
        ) : (
          <Menu className="w-5 h-5 text-calma-taupe" />
        )}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — deep teal + muted copper, the B2B partner space's identity
          color, distinct from the client terracotta and admin midnight/blue
          spaces but part of the same restrained CalmaTrip product family. */}
      <aside
        className={`
          fixed lg:sticky lg:top-0 z-40 h-screen w-72 flex-shrink-0 bg-b2b-teal-deep text-white flex flex-col border-r border-white/[.08]
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="border-b border-white/10 px-5 py-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <CalmaLogo tone="cream" iconSize={26} />
            <span className="rounded-md border border-b2b-copper/30 bg-b2b-copper/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-b2b-copper-soft">
              Partner
            </span>
          </div>

          {/* Partner identity — type + review status, always visible so a
              partner never has to guess which space or state they're in. */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-calma-cream">
              <TypeIcon className="h-3 w-3 text-b2b-teal-soft" />
              {typeLabel}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.onDark}`}
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-calma-cream/40 mb-3 px-4">Menu</p>
            <div className="space-y-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.path, item.exact)
                      ? "bg-b2b-teal-light text-white shadow-sm"
                      : "text-emerald-50/70 hover:bg-white/[.06] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-5 h-5 transition-colors ${
                        isActive(item.path, item.exact) ? "text-white" : "text-emerald-50/60"
                      }`}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {isActive(item.path, item.exact) && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-calma-cream/40 mb-3 px-4">
              Navigation
            </p>
            <div className="space-y-1.5">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-calma-cream/70 hover:bg-white/5 hover:text-calma-cream transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                <span className="font-medium text-sm">Retour au site</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-calma-cream/70 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Se déconnecter</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-center text-calma-cream/40">© 2026 Calma Trip</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3 pl-12 lg:pl-0">
                <div className="min-w-0">
                  <h1 className="truncate font-space text-lg font-semibold tracking-tight text-slate-900 lg:text-xl">
                    {pageTitle}
                  </h1>
                  <p className="hidden text-xs text-slate-500 sm:block">{pageDescription}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.onLight}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {status.label}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-3 lg:ml-0">
                <NotificationBell tone="partner" />
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-b2b-teal">
                    <span className="text-sm font-bold text-white">{userInitials}</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-calma-ink">
                      {session?.user?.name ?? "Partenaire"}
                    </p>
                    <p className="text-xs text-calma-taupe">{session?.user?.email ?? ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content — children from nested routes, or overview as fallback */}
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children ?? <B2BOverview />}
        </div>
      </main>
    </div>
  );
}
