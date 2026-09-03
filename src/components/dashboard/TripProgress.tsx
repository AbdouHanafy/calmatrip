import { Check } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import type { Booking } from "./types";

/**
 * Derives the current step index from real booking fields only — status, date,
 * and whether a review was actually submitted. Never hardcoded per screen.
 *   0 Reçue      — still pending
 *   1 Confirmée  — confirmed, more than 3 days out
 *   2 Préparez-vous — confirmed, within 3 days (or today)
 *   3 Profitez-en   — trip date has passed, no review yet
 *   4 Partagez votre expérience — a review was actually submitted
 */
function currentStepIndex(booking: Booking): number {
  if (booking.status === "pending") return 0;
  const tripDate = new Date(booking.date);
  const today = new Date(new Date().toDateString());
  const daysUntil = Math.round((tripDate.getTime() - today.getTime()) / 86_400_000);

  if (daysUntil > 3) return 1;
  if (daysUntil >= 0) return 2;
  return booking.review ? 4 : 3;
}

/** Horizontal progress timeline — omitted entirely for cancelled bookings, since no "journey" applies. */
export function TripProgress({ booking }: { booking: Booking }) {
  const { t } = useCalmaLang();
  if (booking.status === "cancelled") return null;
  const active = currentStepIndex(booking);
  const steps = [
    t.dash.stepReceived,
    t.dash.stepConfirmed,
    t.dash.stepPrepare,
    t.dash.stepEnjoy,
    t.dash.stepShare,
  ];

  return (
    <div className="flex items-start">
      {steps.map((label, i) => (
        <div key={label} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                i < active
                  ? "border-calma-terracotta bg-calma-terracotta text-calma-ink"
                  : i === active
                    ? "border-calma-terracotta bg-white text-calma-terracotta"
                    : "border-calma-border bg-white text-calma-taupe/40"
              }`}
            >
              {i < active ? (
                <Check className="h-3 w-3" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </div>
            <span
              className={`max-w-[70px] text-center text-[10px] font-semibold leading-tight ${
                i <= active ? "text-calma-ink" : "text-calma-taupe/50"
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`mx-1 h-0.5 flex-1 rounded-full transition-colors ${
                i < active ? "bg-calma-terracotta" : "bg-calma-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
