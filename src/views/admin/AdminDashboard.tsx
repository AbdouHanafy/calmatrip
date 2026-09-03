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
  Search,
  Calendar,
  ChevronRight,
  Menu,
  X,
  ClipboardCheck,
  HelpCircle,
  Mail,
  UserCog,
  CalendarDays,
  Landmark,
  BookOpen,
  MessageCircle,
  Database,
  ShoppingBag,
  Handshake,
  Images,
  PanelTop,
  Settings,
} from "lucide-react";
import { useState } from "react";
import NotificationBell from "@/components/ui/NotificationBell";
import AdminOverview from "./AdminOverview"; // ← import the dynamic version
import { hasPermission } from "@/features/cms/services/permissions";

export default function AdminDashboard({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navQuery, setNavQuery] = useState("");
  const { data: session } = useSession();
  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "AD";

  const role = session?.user?.role;
  const managesLegacyOperations = role === "ADMIN" || role === "SUPER_ADMIN";
  const navGroups = [
    {
      label: "Dashboard",
      items: managesLegacyOperations
        ? [{ path: "/admin", label: "Overview", icon: LayoutDashboard, exact: true }]
        : [],
    },
    {
      label: "Content",
      items: [
        ...(hasPermission(role, "cms.read")
          ? [{ path: "/admin/cms", label: "Collections", icon: Database, exact: true }]
          : []),
        ...(hasPermission(role, "media.manage")
          ? [{ path: "/admin/cms/media", label: "Media Library", icon: Images }]
          : []),
        ...(hasPermission(role, "navigation.manage")
          ? [{ path: "/admin/cms/navigation", label: "Navigation", icon: PanelTop }]
          : []),
        ...(hasPermission(role, "settings.manage")
          ? [{ path: "/admin/cms/settings", label: "Site Settings", icon: Settings }]
          : []),
        ...(managesLegacyOperations
          ? [
              { path: "/admin/services", label: "Experiences & services", icon: Package },
              { path: "/admin/events", label: "Events", icon: CalendarDays },
              { path: "/admin/museums", label: "Museums", icon: Landmark },
              { path: "/admin/guides", label: "Blog & guides", icon: BookOpen },
              { path: "/admin/faq", label: "FAQ", icon: HelpCircle },
              { path: "/admin/reviews", label: "Reviews", icon: MessageCircle },
              { path: "/admin/community", label: "Community", icon: Users },
            ]
          : []),
      ],
    },
    {
      label: "Commerce",
      items: managesLegacyOperations
        ? [
            { path: "/admin/bookings", label: "Reservations", icon: Calendar },
            { path: "/admin/marketplace", label: "Marketplace", icon: ShoppingBag },
            { path: "/admin/clients", label: "Customers", icon: Users },
          ]
        : [],
    },
    {
      label: "Partners & forms",
      items: [
        ...(hasPermission(role, "forms.submissions.read")
          ? [{ path: "/admin/cms/submissions", label: "Form submissions", icon: ClipboardCheck }]
          : []),
        ...(managesLegacyOperations
          ? [
              { path: "/admin/b2b-submissions", label: "Applications", icon: ClipboardCheck },
              { path: "/admin/b2b-partners", label: "Partners & commissions", icon: Handshake },
              { path: "/admin/contacts", label: "Contact submissions", icon: Mail },
              { path: "/admin/newsletter", label: "Newsletter", icon: Mail },
            ]
          : []),
      ],
    },
    {
      label: "Users & access",
      items: hasPermission(role, "users.manage")
        ? [{ path: "/admin/access", label: "Admin users", icon: UserCog }]
        : [],
    },
  ].filter((group) => group.items.length > 0);

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return pathname === path;
    return pathname?.startsWith(path);
  };
  const currentNavItem = navGroups
    .flatMap((group) => group.items)
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) => isActive(item.path, "exact" in item ? (item.exact as boolean) : undefined));
  const pageTitle = currentNavItem?.label ?? "Backoffice";
  const visibleNavGroups = navQuery.trim()
    ? navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.label.toLowerCase().includes(navQuery.trim().toLowerCase()),
          ),
        }))
        .filter((group) => group.items.length)
    : navGroups;

  return (
    <div className="admin-workspace min-h-screen font-hanken flex text-calma-ink">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm lg:hidden"
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
          fixed flex lg:sticky lg:top-0 z-40 h-screen w-72 flex-shrink-0 bg-admin-navy-deeper text-white flex-col border-r border-white/[.07]
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <Image
              src="/images/logo-cream.png"
              alt="CalmaTrip"
              width={170}
              height={52}
              className="h-8 w-auto"
              priority
            />
            <span className="rounded-md border border-admin-gold/30 bg-admin-gold/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-admin-gold-soft">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {visibleNavGroups.map((group) => (
            <div className="mb-5" key={group.label}>
              <p className="text-[11px] uppercase tracking-[.16em] text-calma-cream/40 mb-2 px-4">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => {
                      setSidebarOpen(false);
                      setNavQuery("");
                    }}
                    className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive(item.path, "exact" in item ? item.exact : undefined)
                        ? "bg-admin-gold text-white shadow-sm"
                        : "text-slate-300 hover:bg-white/[.06] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`w-5 h-5 transition-colors ${
                          isActive(item.path, "exact" in item ? item.exact : undefined)
                            ? "text-white"
                            : "text-slate-400"
                        }`}
                      />
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {isActive(item.path, "exact" in item ? item.exact : undefined) && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}

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
        <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="min-w-0 pl-12 lg:pl-0">
                <h1 className="truncate font-space text-lg font-semibold tracking-tight text-slate-900 lg:text-xl">
                  {pageTitle}
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Operations and content workspace
                </p>
              </div>

              <div className="flex items-center gap-4 ml-auto lg:ml-0">
                {/* Search */}
                <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
                  <Search className="w-4 h-4 text-calma-taupe" />
                  <input
                    type="text"
                    value={navQuery}
                    onChange={(event) => setNavQuery(event.target.value)}
                    placeholder="Search navigation..."
                    className="ml-2 w-44 border-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                {/* Notifications */}
                <NotificationBell tone="admin" />

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
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-admin-navy">
                      <span className="text-calma-cream text-sm font-bold">{userInitials}</span>
                    </div>
                  )}
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-calma-ink">
                      {session?.user?.name ?? "Admin"}
                    </p>
                    <p className="text-xs text-calma-taupe">
                      {session?.user?.role?.replaceAll("_", " ") ?? ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content — children from nested routes, or overview as fallback */}
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children ?? <AdminOverview />}
        </div>
      </main>
    </div>
  );
}
