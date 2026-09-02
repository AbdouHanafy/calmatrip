import { Calendar, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import type { Stats } from "./types";

export function BookingStatsCards({ stats }: { stats: Stats }) {
  const statCards = [
    {
      label: "Total Bookings",
      value: stats.total,
      icon: Calendar,
      sub: "all time",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      sub: "in progress",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: AlertCircle,
      sub: "to process",
    },
    {
      label: "Revenue",
      value: `${stats.revenue.toLocaleString()} TND`,
      icon: DollarSign,
      sub: "confirmed only",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCards.map((stat, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100">
              <stat.icon className="h-5 w-5 text-admin-navy" />
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
              {stat.sub}
            </span>
          </div>
          <h3 className="mb-1 text-2xl font-bold text-slate-900">{stat.value}</h3>
          <p className="text-sm text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
