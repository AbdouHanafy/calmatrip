"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  Bell,
  Search,
  Calendar,
  ChevronRight,
  Menu,
  X,
  ClipboardCheck,
  HelpCircle,
  Mail,
  UserCog,
  Percent,
  CalendarDays,
  Landmark,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import NotificationBell from "@/components/ui/NotificationBell";
import AdminOverview from "./AdminOverview"; // ← import the dynamic version

export default function AdminDashboard({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "AD";

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: "/admin/services", label: "Manage Services", icon: Package },
    { path: "/admin/clients", label: "Manage Clients", icon: Users },
    { path: "/admin/bookings", label: "Bookings", icon: Calendar },
    { path: "/admin/marketplace", label: "Manage Products", icon: Package },
    { path: "/admin/contacts", label: "Manage Contacts", icon: Users },
    { path: "/admin/reviews", label: "Manage Reviews", icon: Package },
    { path: "/admin/community", label: "Community", icon: MessageCircle },
    { path: "/admin/b2b-submissions", label: "B2B Submissions", icon: ClipboardCheck },
    { path: "/admin/b2b-partners", label: "Commissions", icon: Percent },
    { path: "/admin/events", label: "Events", icon: CalendarDays },
    { path: "/admin/museums", label: "Museums", icon: Landmark },
    { path: "/admin/guides", label: "Practical Guides", icon: BookOpen },
    { path: "/admin/faq", label: "FAQ", icon: HelpCircle },
    { path: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { path: "/admin/access", label: "Admin Access", icon: UserCog },
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
          <X className="w-5 h-5 text-calma-terracotta" />
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

      {/* Sidebar — deep navy + gold, deliberately distinct from the client
          space's terracotta identity so staff never confuse the two contexts */}
      <aside
        className={`
          fixed lg:relative z-40 w-72 bg-gradient-to-b from-admin-navy-deeper via-admin-navy-deep to-admin-navy-deeper text-calma-cream flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-admin-navy flex items-center justify-center shadow-lg border border-admin-gold/30">
                <LayoutDashboard className="w-6 h-6 text-admin-gold" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-admin-gold rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="font-fraunces text-xl font-normal text-calma-cream">Admin</h2>
              <p className="text-xs text-calma-cream/50">Calma Trip</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-calma-cream/40 mb-3 px-4">
              Main Menu
            </p>
            <div className="space-y-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.path, item.exact)
                      ? "bg-admin-gold/[.16] text-calma-cream border border-admin-gold/30"
                      : "text-calma-cream/70 hover:bg-white/5 hover:text-calma-cream"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-5 h-5 transition-colors ${
                        isActive(item.path, item.exact) ? "text-admin-gold-soft" : ""
                      }`}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {isActive(item.path, item.exact) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-admin-gold-soft" />
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
                <span className="font-medium text-sm">Back to Site</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-calma-cream/70 hover:bg-admin-rose/10 hover:text-red-300 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Sign out</span>
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
                <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Dashboard</h1>
                <p className="text-sm text-calma-taupe">Welcome to your admin space</p>
              </div>

              <div className="flex items-center gap-4 ml-auto lg:ml-0">
                {/* Search */}
                <div className="hidden md:flex items-center bg-calma-sand rounded-xl px-3 py-2">
                  <Search className="w-4 h-4 text-calma-taupe" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none focus:outline-none text-sm ml-2 w-48 text-calma-ink placeholder:text-calma-taupe/60"
                  />
                </div>

                {/* Notifications */}
                <NotificationBell />

                {/* Profile */}
                <div className="flex items-center gap-3">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt=""
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-admin-navy flex items-center justify-center">
                      <span className="text-calma-cream text-sm font-bold">{userInitials}</span>
                    </div>
                  )}
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-calma-ink">
                      {session?.user?.name ?? "Admin"}
                    </p>
                    <p className="text-xs text-calma-taupe">{session?.user?.email ?? ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content — children from nested routes, or overview as fallback */}
        <div className="p-4 sm:p-6 lg:p-8">{children ?? <AdminOverview />}</div>
      </main>
    </div>
  );
}
