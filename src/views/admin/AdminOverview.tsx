"use client";
import Link from "next/link";
import {
  Calendar,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Star,
  Car,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  paidBookings: number;
  totalClients: number;
  totalServices: number;
  revenue: number;
}

// Flat model — no user/service relations, matches seed schema
interface RecentBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  service: string; // plain string e.g. "Airport Transfer"
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  price: string; // e.g. "35 TND"
}

interface TopService {
  name: string;
  bookings: number;
  percent: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentBookings: RecentBooking[];
  topServices: TopService[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SERVICE_COLORS = ["#243b63", "#3d67b5", "#5683d8", "#82a7eb", "#17233b"];

function StatusBadge({ status }: { status: RecentBooking["status"] }) {
  const map = {
    confirmed: "border border-blue-200 bg-blue-50 text-blue-700",
    pending: "border border-amber-200 bg-amber-50 text-amber-700",
    cancelled: "bg-red-500/10 text-red-500 border border-red-500/20",
  } as const;
  const label = { confirmed: "Confirmed", pending: "Pending", cancelled: "Cancelled" };
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${map[status]}`}>
      {label[status]}
    </span>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-calma-border animate-pulse rounded-xl ${className}`} />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetch("/api/admin/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json() as Promise<DashboardData>;
      })
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonBlock className="h-80" />
          <SkeletonBlock className="h-80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-36" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-500 font-medium">Failed to load dashboard data</p>
        <button onClick={load} className="text-sm text-admin-navy underline hover:text-admin-gold">
          Retry
        </button>
      </div>
    );
  }

  const { stats, recentBookings, topServices } = data;

  const statCards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      sub: `${stats.pendingBookings} pending`,
      icon: Calendar,
      accent: "#243b63",
      iconBg: "bg-admin-navy",
    },
    {
      label: "Unique Clients",
      value: stats.totalClients.toLocaleString(),
      sub: "distinct customers",
      icon: Users,
      accent: "#5683d8",
      iconBg: "bg-admin-gold",
    },
    {
      label: "Services",
      value: stats.totalServices.toLocaleString(),
      sub: "in catalog",
      icon: Package,
      accent: "#17233b",
      iconBg: "bg-admin-navy-deep",
    },
    {
      label: "Paid booking revenue",
      value: `${stats.revenue.toLocaleString()} TND`,
      sub: `${stats.paidBookings} paid bookings`,
      icon: DollarSign,
      accent: "#3d67b5",
      iconBg: "bg-admin-gold-deep",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-calma-border"
          >
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: stat.accent }} />
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-calma-taupe bg-calma-sand px-2 py-1 rounded-lg">
                {stat.sub}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-calma-ink mb-1">{stat.value}</h3>
            <p className="text-sm text-calma-taupe">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-calma-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-calma-ink">Recent Activity</h3>
              <p className="text-sm text-calma-taupe">Latest bookings</p>
            </div>
            <TrendingUp className="w-5 h-5 text-admin-navy" />
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-sm text-calma-taupe text-center py-8">No bookings yet</p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-calma-sand transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-admin-gold/10">
                      <Car className="w-5 h-5 text-admin-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-calma-ink text-sm">{booking.customerName}</p>
                      <p className="text-xs text-calma-taupe">{booking.service}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-calma-ink">{booking.price}</p>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/admin/bookings"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-admin-navy hover:text-admin-gold transition-colors"
          >
            <span>View all bookings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-calma-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-calma-ink">Popular Services</h3>
              <p className="text-sm text-calma-taupe">Best sellers</p>
            </div>
            <Star className="w-5 h-5 text-admin-gold" />
          </div>

          {topServices.length === 0 ? (
            <p className="text-sm text-calma-taupe text-center py-8">No service data yet</p>
          ) : (
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={service.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: SERVICE_COLORS[index % SERVICE_COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-calma-ink">{service.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-calma-ink">{service.bookings}</span>
                  </div>
                  <div className="w-full h-2 bg-calma-sand rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${service.percent}%`,
                        backgroundColor: SERVICE_COLORS[index % SERVICE_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-calma-border bg-admin-navy/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-admin-navy">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-calma-ink">Add a Service</h3>
          </div>
          <p className="text-sm text-calma-taupe mb-4">
            Create a new service to enrich your catalog
          </p>
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-admin-navy hover:text-admin-gold transition-colors"
          >
            Create <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-calma-border bg-admin-gold/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-admin-gold">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-calma-ink">Customer records</h3>
          </div>
          <p className="text-sm text-calma-taupe mb-4">
            Review traveler profiles and booking history
          </p>
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-2 text-sm font-medium text-admin-gold hover:text-admin-navy transition-colors"
          >
            Open <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-calma-border bg-admin-navy-deep/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-admin-navy-deep">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-calma-ink">View Bookings</h3>
          </div>
          <p className="text-sm text-calma-taupe mb-4">View and manage all bookings</p>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-2 text-sm font-medium text-admin-navy hover:text-admin-gold transition-colors"
          >
            Access <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
