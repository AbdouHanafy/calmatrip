import { Calendar, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import type { Stats } from "./types";

export function BookingStatsCards({ stats }: { stats: Stats }) {
  const statCards = [
    {
      label: "Total Bookings",
      value: stats.total,
      icon: Calendar,
      gradient: "from-[#F2994A] to-[#5E8B63]",
      sub: "all time",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      gradient: "from-[#5E8B63] to-[#4C7350]",
      sub: "in progress",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: AlertCircle,
      gradient: "from-[#D9A441] to-[#D9A441]",
      sub: "to process",
    },
    {
      label: "Revenue",
      value: `${stats.revenue.toLocaleString()} TND`,
      icon: DollarSign,
      gradient: "from-[#F2994A] to-[#D9A441]",
      sub: "confirmed only",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCards.map((stat, i) => (
        <div
          key={i}
          className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-calma-border"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-calma-taupe bg-calma-sand px-2 py-1 rounded-full">
              {stat.sub}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-calma-ink mb-1">{stat.value}</h3>
          <p className="text-sm text-calma-taupe">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
