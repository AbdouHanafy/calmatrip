import { Calendar } from "lucide-react";
import type { DateAvailability } from "./types";
import { toISODate } from "./types";

interface DateSelectorProps {
  date: string;
  onChange: (date: string) => void;
  availableDates: DateAvailability[];
}

export function DateSelector({ date, onChange, availableDates }: DateSelectorProps) {
  return (
    <div>
      <label className="text-sm font-bold text-gray-700 block mb-3 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#87CEEB]" />
        Select Date
      </label>
      <div className="relative">
        <input
          type="date"
          value={date}
          onChange={(e) => onChange(e.target.value)}
          min={toISODate(new Date())}
          className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-gray-50/50"
        />
      </div>
      {availableDates.length > 0 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {availableDates.slice(0, 7).map((d) => (
            <button
              key={d.date}
              type="button"
              onClick={() => onChange(d.date)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                date === d.date
                  ? "border-[#4CAF50] bg-[#4CAF50]/10 text-[#4CAF50]"
                  : "border-gray-200 hover:border-[#87CEEB] hover:bg-gray-50"
              }`}
            >
              {new Date(d.date).toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
              <span className="block text-[9px] text-gray-400 mt-0.5">{d.remaining} spots</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
