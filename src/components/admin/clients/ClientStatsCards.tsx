import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import type { DashboardStats, StatCard } from "./types";

export function ClientStatsCards({ dashboardStats }: { dashboardStats: DashboardStats }) {
  const stats: StatCard[] = [
    {
      label: "Total Clients",
      value: dashboardStats.totalClients,
      icon: Users,
      change: "+15%",
    },
    {
      label: "Active Clients",
      value: dashboardStats.activeClients,
      icon: UserCheck,
      change: "Available",
    },
    {
      label: "Blocked Clients",
      value: dashboardStats.blockedClients,
      icon: UserX,
      change: "To review",
    },
    {
      label: "Total Bookings",
      value: dashboardStats.totalBookings,
      icon: TrendingUp,
      change: "+28%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100">
              <stat.icon className="h-5 w-5 text-admin-navy" />
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
              {stat.change}
            </span>
          </div>
          <h3 className="mb-1 text-2xl font-bold text-slate-900">{stat.value}</h3>
          <p className="text-sm text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
