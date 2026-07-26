"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Compass,
  LogOut,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import B2BOverview from "./B2BOverview";

export default function B2BDashboard({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const b2bType = session?.user?.b2bType;
  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "B2";

  const navItems = [
    { path: "/b2b", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
    ...(b2bType === "ARTISAN"
      ? [{ path: "/b2b/products", label: "Mes produits", icon: Package }]
      : []),
    ...(b2bType === "AGENCY"
      ? [{ path: "/b2b/services", label: "Mes services", icon: Compass }]
      : []),
    {
      path: "/b2b/sales",
      label: b2bType === "AGENCY" ? "Réservations" : "Ventes",
      icon: TrendingUp,
    },
    { path: "/b2b/profile", label: "Mon profil", icon: UserCog },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return pathname === path;
    return pathname?.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-calma-sand font-hanken flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-calma-border"
      >
        {sidebarOpen ? (
          <X className="w-5 h-5 text-calma-gold" />
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

      {/* Sidebar — warm bronze/gold, the B2B partner space's identity color */}
      <aside
        className={`
          fixed lg:relative z-40 w-72 bg-gradient-to-b from-[#241A12] via-[#3D2A14] to-[#241A12] text-calma-cream flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-calma-gold flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-6 h-6 text-[#241A12]" />
              </div>
            </div>
            <div>
              <h2 className="font-fraunces text-xl font-normal text-calma-cream">
                Espace partenaire
              </h2>
              <p className="text-xs text-calma-cream/50">Calma Trip</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
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
                      ? "bg-calma-gold/[.18] text-calma-cream border border-calma-gold/25"
                      : "text-calma-cream/70 hover:bg-white/5 hover:text-calma-cream"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-5 h-5 transition-colors ${
                        isActive(item.path, item.exact) ? "text-calma-gold" : ""
                      }`}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {isActive(item.path, item.exact) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-calma-gold" />
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
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-calma-border">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="hidden lg:block">
                <h1 className="font-fraunces text-2xl font-normal text-calma-ink">
                  {b2bType === "ARTISAN"
                    ? "Espace artisan"
                    : b2bType === "AGENCY"
                      ? "Espace agence"
                      : "Espace partenaire"}
                </h1>
                <p className="text-sm text-calma-taupe">Gérez vos annonces sur Calma Trip</p>
              </div>

              <div className="flex items-center gap-4 ml-auto lg:ml-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-calma-gold flex items-center justify-center">
                    <span className="text-[#241A12] text-sm font-bold">{userInitials}</span>
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
        <div className="p-4 sm:p-6 lg:p-8">{children ?? <B2BOverview />}</div>
      </main>
    </div>
  );
}
