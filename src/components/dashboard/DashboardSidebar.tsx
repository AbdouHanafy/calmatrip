import Link from "next/link";
import { signOut } from "next-auth/react";
import { Calendar, Plus, LayoutDashboard, LogOut, ChevronRight, Menu, X } from "lucide-react";

type TabKey = "bookings" | "new";

const navItems = [
  { key: "bookings" as const, label: "Mes réservations", icon: Calendar },
  { key: "new" as const, label: "Nouvelle réservation", icon: Plus },
];

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function DashboardSidebar({
  sidebarOpen,
  onToggleSidebar,
  onCloseSidebar,
  activeTab,
  onTabChange,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={sidebarOpen}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-calma-border"
      >
        {sidebarOpen ? (
          <X className="w-5 h-5 text-calma-terracotta" />
        ) : (
          <Menu className="w-5 h-5 text-calma-taupe" />
        )}
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onCloseSidebar} />
      )}

      {/* Sidebar — deep terracotta, the traveler space's identity color */}
      <aside
        className={`
          fixed lg:relative z-40 w-72 bg-gradient-to-b from-[#4A2818] via-[#5C3620] to-[#4A2818] text-calma-cream flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-calma-terracotta flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-fraunces text-xl font-normal text-calma-cream">Mon espace</h2>
              <p className="text-xs text-calma-cream/50">Calma Trip</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-calma-cream/40 mb-3 px-4">Menu</p>
            <div className="space-y-1.5">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onTabChange(item.key);
                    onCloseSidebar();
                  }}
                  className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.key
                      ? "bg-calma-terracotta/[.18] text-calma-cream border border-calma-terracotta/25"
                      : "text-calma-cream/70 hover:bg-white/5 hover:text-calma-cream"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-5 h-5 transition-colors ${activeTab === item.key ? "text-calma-terracotta-soft" : ""}`}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {activeTab === item.key && (
                    <div className="w-1.5 h-1.5 rounded-full bg-calma-terracotta-soft" />
                  )}
                </button>
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

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-center text-calma-cream/40">© 2026 Calma Trip</p>
        </div>
      </aside>
    </>
  );
}
