import { Tag, CheckCircle, EyeOff, Filter } from "lucide-react";
import type { Service } from "./types";

export function ServiceStatsCards({ services }: { services: Service[] }) {
  const stats = [
    {
      label: "Total Services",
      value: services.length,
      icon: Tag,
      gradient: "from-[#F2994A] to-[#5E8B63]",
      change: `${services.length} registered`,
    },
    {
      label: "Active",
      value: services.filter((s) => s.active).length,
      icon: CheckCircle,
      gradient: "from-[#5E8B63] to-[#4C7350]",
      change: "Available",
    },
    {
      label: "Inactive",
      value: services.filter((s) => !s.active).length,
      icon: EyeOff,
      gradient: "from-red-500 to-red-600",
      change: "To reactivate",
    },
    {
      label: "Categories",
      value: new Set(services.map((s) => s.category).filter(Boolean)).size,
      icon: Filter,
      gradient: "from-[#D9A441] to-[#D9A441]",
      change: "Active",
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
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
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
