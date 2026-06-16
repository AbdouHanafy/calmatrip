'use client';
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
  totalClients: number;
  totalServices: number;
  revenue: number;
}

// Flat model — no user/service relations, matches seed schema
interface RecentBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  service: string;        // plain string e.g. "Airport Transfer"
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  price: string;          // e.g. "35 TND"
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

const SERVICE_COLORS = ["#87CEEB", "#4CAF50", "#FFD700", "#87CEEB", "#4CAF50"];

function StatusBadge({ status }: { status: RecentBooking["status"] }) {
  const map = {
    confirmed: "bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20",
    pending: "bg-[#FFD700]/10 text-[#856B00] border border-[#FFD700]/20",
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
  return <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AdminOverview() {
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
        <button
          onClick={load}
          className="text-sm text-[#87CEEB] underline hover:text-[#4CAF50]"
        >
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
      gradient: "from-[#87CEEB] to-[#4CAF50]",
    },
    {
      label: "Unique Clients",
      value: stats.totalClients.toLocaleString(),
      sub: "distinct customers",
      icon: Users,
      gradient: "from-[#FFD700] to-[#FFC107]",
    },
    {
      label: "Services",
      value: stats.totalServices.toLocaleString(),
      sub: "in catalog",
      icon: Package,
      gradient: "from-[#4CAF50] to-[#45A049]",
    },
    {
      label: "Revenue",
      value: `${stats.revenue.toLocaleString()} TND`,
      sub: `${stats.confirmedBookings} confirmed`,
      icon: DollarSign,
      gradient: "from-[#87CEEB] to-[#FFD700]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                {stat.sub}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Latest bookings</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#87CEEB]" />
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No bookings yet</p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#87CEEB]/10 to-[#4CAF50]/10 flex items-center justify-center">
                      <Car className="w-5 h-5 text-[#87CEEB]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{booking.customerName}</p>
                      <p className="text-xs text-gray-500">{booking.service}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-gray-900">{booking.price}</p>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/admin/bookings"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-[#87CEEB] hover:text-[#4CAF50] transition-colors"
          >
            <span>View all bookings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Popular Services</h3>
              <p className="text-sm text-gray-500">Best sellers</p>
            </div>
            <Star className="w-5 h-5 text-[#FFD700]" />
          </div>

          {topServices.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No service data yet</p>
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
                      <span className="text-sm font-medium text-gray-700">{service.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{service.bookings}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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
        <div className="bg-gradient-to-r from-[#87CEEB]/10 to-[#4CAF50]/10 rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Add a Service</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Create a new service to enrich your catalog</p>
          <Link href="/admin/services" className="inline-flex items-center gap-2 text-sm font-medium text-[#87CEEB] hover:text-[#4CAF50] transition-colors">
            Create <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFC107]/10 rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC107] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">New Client</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Add a client to your database</p>
          <Link href="/admin/clients" className="inline-flex items-center gap-2 text-sm font-medium text-[#FFD700] hover:text-[#FFC107] transition-colors">
            Add <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-[#4CAF50]/10 to-[#45A049]/10 rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#4CAF50] to-[#45A049] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">View Bookings</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">View and manage all bookings</p>
          <Link href="/admin/bookings" className="inline-flex items-center gap-2 text-sm font-medium text-[#4CAF50] hover:text-[#45A049] transition-colors">
            Access <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}