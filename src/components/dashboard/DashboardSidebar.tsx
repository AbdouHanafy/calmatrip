import Link from "next/link";
import { signOut } from "next-auth/react";
import { Calendar, Plus, CreditCard, Star, User, ArrowLeft, LogOut } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

export type TabKey = "bookings" | "new" | "payments" | "reviews" | "profile";

interface DashboardSidebarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  /** Real count of upcoming (non-cancelled) trips — the badge is omitted entirely when 0, never shown as "0". */
  upcomingCount?: number;
  /** Real count of confirmed bookings still awaiting payment. */
  actionRequiredCount?: number;
  /** Real count of past bookings eligible for a review that hasn't been left yet. */
  toReviewCount?: number;
  userName: string;
  userInitials: string;
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  upcomingCount = 0,
  actionRequiredCount = 0,
  toReviewCount = 0,
  userName,
  userInitials,
}: DashboardSidebarProps) {
  const { t } = useCalmaLang();
  const navItems = [
    {
      key: "bookings" as const,
      label: t.dash.navBookings,
      icon: Calendar,
      caption:
        upcomingCount > 0
          ? `${upcomingCount} ${upcomingCount > 1 ? t.dash.upcomingExpPlural : t.dash.upcomingExpSingular}`
          : null,
    },
    { key: "new" as const, label: t.dash.navNew, icon: Plus, caption: null },
    {
      key: "payments" as const,
      label: t.dash.navPayments,
      icon: CreditCard,
      caption:
        actionRequiredCount > 0
          ? `${actionRequiredCount} ${actionRequiredCount > 1 ? t.dash.actionRequiredPlural : t.dash.actionRequiredSingular}`
          : null,
    },
    {
      key: "reviews" as const,
      label: t.dash.navReviews,
      icon: Star,
      caption:
        toReviewCount > 0
          ? `${toReviewCount} ${toReviewCount > 1 ? t.dash.toReviewPlural : t.dash.toReviewSingular}`
          : null,
    },
    { key: "profile" as const, label: t.dash.navProfile, icon: User, caption: null },
  ];

  return (
    <>
      {/* Desktop — a compact, self-contained card that sticks near the top of the
          viewport as you scroll; it never stretches to match the main column's
          height (that's what produced the large dead space below the nav items). */}
      <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0 lg:p-4">
        <div className="rounded-3xl border border-calma-border bg-calma-cream p-5 shadow-sm lg:sticky lg:top-4">
          <div className="flex items-center gap-3.5 pb-5">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-calma-terracotta text-lg font-bold text-calma-ink">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-calma-ink">{userName}</p>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-calma-taupe underline decoration-calma-taupe/40 underline-offset-2 transition-colors hover:text-calma-terracotta"
              >
                {t.dash.signOut}
              </button>
            </div>
          </div>

          <div className="h-px bg-calma-border" />

          <nav className="space-y-1 pt-3">
            {navItems.map((item) => {
              const highlighted = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onTabChange(item.key)}
                  className="flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left transition-colors hover:bg-calma-olive/[.05]"
                >
                  <item.icon
                    className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                      highlighted ? "text-calma-terracotta" : "text-calma-taupe"
                    }`}
                    strokeWidth={1.6}
                  />
                  <span>
                    <span
                      className={`block text-[15px] font-semibold ${
                        highlighted ? "text-calma-terracotta" : "text-calma-ink"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.caption && (
                      <span className="block text-xs font-medium text-calma-terracotta/80">
                        {item.caption}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="my-2 h-px bg-calma-border" />

          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-medium text-calma-ink/60 no-underline transition-colors hover:bg-calma-olive/[.05] hover:text-calma-ink"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.6} />
            {t.dash.backToSite}
          </Link>
        </div>
      </aside>

      {/* Mobile — a compact, horizontally scrollable icon row, never a panel that covers the page */}
      <nav className="calma-scrollbar-hide sticky top-0 z-30 flex items-center gap-1 overflow-x-auto border-b border-calma-border bg-calma-cream px-3 py-2 lg:hidden">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-calma-terracotta text-xs font-bold text-calma-ink">
          {userInitials}
        </div>
        <div className="mx-1 h-6 w-px flex-shrink-0 bg-calma-border" />
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            aria-label={item.label}
            aria-pressed={activeTab === item.key}
            className={`relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
              activeTab === item.key
                ? "bg-calma-terracotta/10 text-calma-terracotta"
                : "text-calma-ink/60 hover:bg-calma-olive/[.06]"
            }`}
          >
            <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {item.caption && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-calma-terracotta text-[9px] font-bold text-calma-ink">
                {item.key === "bookings"
                  ? upcomingCount
                  : item.key === "payments"
                    ? actionRequiredCount
                    : toReviewCount}
              </span>
            )}
          </button>
        ))}
        <Link
          href="/"
          aria-label={t.dash.backToSite}
          className="ml-auto flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-calma-ink/60 no-underline transition-colors hover:bg-calma-olive/[.06]"
        >
          <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          aria-label={t.dash.signOut}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-calma-ink/40 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
      </nav>
    </>
  );
}
