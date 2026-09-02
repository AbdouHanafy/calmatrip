import { Clock } from "lucide-react";
import type { TimeSlotOption } from "./types";

interface TimeSelectorProps {
  useManualTime: boolean;
  onSwitchToManual: () => void;
  time: string;
  onTimeChange: (time: string) => void;
  manualTime: string;
  onManualTimeChange: (time: string) => void;
  slots: TimeSlotOption[];
}

export function TimeSelector({
  useManualTime,
  onSwitchToManual,
  time,
  onTimeChange,
  manualTime,
  onManualTimeChange,
  slots,
}: TimeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Clock className="h-4 w-4 text-calma-terracotta" />
          Select Time
        </label>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={onSwitchToManual}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              useManualTime
                ? "bg-white shadow-md text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Manual
          </button>
        </div>
      </div>

      {!useManualTime ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.length === 0 ? (
            <div className="col-span-full text-center py-6 text-sm text-gray-400 bg-gray-50 rounded-2xl">
              No slots available
            </div>
          ) : (
            slots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                disabled={slot.full}
                onClick={() => onTimeChange(slot.time)}
                className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                  time === slot.time
                    ? "border-calma-terracotta bg-calma-terracotta/10 text-calma-terracotta shadow-sm"
                    : slot.full
                      ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                      : "border-gray-100 hover:border-calma-terracotta hover:bg-gray-50"
                }`}
              >
                <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                {slot.time}
              </button>
            ))
          )}
        </div>
      ) : (
        <input
          type="time"
          value={manualTime}
          onChange={(e) => onManualTimeChange(e.target.value)}
          className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3.5 outline-none transition-all focus:border-calma-terracotta focus:ring-2 focus:ring-calma-terracotta/20"
        />
      )}
    </div>
  );
}
