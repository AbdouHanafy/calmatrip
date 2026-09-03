import { Car, ChevronRight } from "lucide-react";
import type { ServiceOption } from "./types";

interface ServiceSelectorProps {
  services: ServiceOption[];
  loading: boolean;
  serviceId: number | "";
  onSelect: (id: number) => void;
}

export function ServiceSelector({ services, loading, serviceId, onSelect }: ServiceSelectorProps) {
  return (
    <div>
      <label className="text-sm font-bold text-gray-700 block mb-3 flex items-center gap-2">
        <Car className="h-4 w-4 text-calma-terracotta" />
        Choose Service
      </label>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-2xl">
          <p className="text-sm text-gray-400">No services available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`group text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                serviceId === s.id
                  ? "border-calma-terracotta bg-calma-terracotta/5 shadow-sm"
                  : "border-gray-100 hover:border-calma-terracotta/50 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      serviceId === s.id
                        ? "bg-calma-terracotta text-calma-ink"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{s.title}</div>
                    {s.subtitle && <div className="text-xs text-gray-500">{s.subtitle}</div>}
                  </div>
                </div>
                <div
                  className={`text-sm font-bold ${serviceId === s.id ? "text-calma-terracotta" : "text-gray-400"}`}
                >
                  {s.price}
                </div>
              </div>
              {serviceId === s.id && (
                <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-calma-terracotta">
                  <ChevronRight className="w-3 h-3" />
                  Selected
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
