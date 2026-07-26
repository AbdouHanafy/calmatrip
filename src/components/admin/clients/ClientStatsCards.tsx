import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import type { DashboardStats, StatCard } from "./types";

export function ClientStatsCards({ dashboardStats }: { dashboardStats: DashboardStats }) {
  const stats: StatCard[] = [
    {
      label: "Total Clients",
      value: dashboardStats.totalClients,
      icon: Users,
      gradient: "from-[#F2994A] to-[#5E8B63]",
      change: "+15%",
    },
    {
      label: "Active Clients",
      value: dashboardStats.activeClients,
      icon: UserCheck,
      gradient: "from-[#5E8B63] to-[#4C7350]",
      change: "Available",
    },
    {
      label: "Blocked Clients",
      value: dashboardStats.blockedClients,
      icon: UserX,
      gradient: "from-red-500 to-red-600",
      change: "To review",
    },
    {
      label: "Total Bookings",
      value: dashboardStats.totalBookings,
      icon: TrendingUp,
      gradient: "from-[#D9A441] to-[#D9A441]",
      change: "+28%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-calma-border"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-calma-taupe bg-calma-sand px-2 py-1 rounded-full">
              {stat.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-calma-ink mb-1">{stat.value}</h3>
          <p className="text-sm text-calma-taupe">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
