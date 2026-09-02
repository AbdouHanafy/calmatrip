import { Tag, CheckCircle, EyeOff, Filter } from "lucide-react";
import type { Service } from "./types";

export function ServiceStatsCards({ services }: { services: Service[] }) {
  const stats = [
    {
      label: "Total Services",
      value: services.length,
      icon: Tag,
      change: `${services.length} registered`,
    },
    {
      label: "Active",
      value: services.filter((s) => s.active).length,
      icon: CheckCircle,
      change: "Available",
    },
    {
      label: "Inactive",
      value: services.filter((s) => !s.active).length,
      icon: EyeOff,
      change: "To reactivate",
    },
    {
      label: "Categories",
      value: new Set(services.map((s) => s.category).filter(Boolean)).size,
      icon: Filter,
      change: "Active",
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
