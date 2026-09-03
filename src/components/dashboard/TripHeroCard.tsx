import Image from "next/image";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { TripProgress } from "./TripProgress";
import type { Booking, ServiceInfo } from "./types";

/** Friendly, readable reference derived from the real booking id — never a fabricated code. */
function reference(id: string) {
  return `CT-${id.padStart(5, "0")}`;
}

export function TripHeroCard({
  booking,
  service,
  onDetails,
}: {
  booking: Booking;
  service: ServiceInfo | null;
  onDetails: () => void;
}) {
  const { t } = useCalmaLang();
  const dateLabel = new Date(booking.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const returnDateLabel =
    booking.tripType === "round-trip" && booking.returnDate
      ? new Date(booking.returnDate).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-calma-border bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,360px)_1fr]">
        <div className="relative h-52 md:h-full min-h-[240px] overflow-hidden">
          {service?.image ? (
            <Image
              src={service.image}
              alt={booking.service}
              fill
              sizes="(min-width: 768px) 360px, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ backgroundColor: "#15242E" }}
            >
              <MapPin className="h-10 w-10 text-white/25" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="flex flex-col p-5 md:p-6">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-calma-terracotta">
            {t.dash.yourNextExperience}
          </p>
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-calma-taupe">
                {t.dash.reservationRef} {reference(booking.id)}
              </p>
              <h2 className="font-fraunces text-xl font-normal text-calma-ink">
                {booking.service}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <BookingStatusBadge status={booking.status} />
              <PaymentStatusBadge status={booking.paymentStatus} />
            </div>
          </div>

          <div className="mb-4">
            <TripProgress booking={booking} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-calma-taupe sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-calma-terracotta" />
              {returnDateLabel ? `${dateLabel} → ${returnDateLabel}` : dateLabel}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-calma-terracotta" />
              {booking.time}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0 text-calma-terracotta" />
              {booking.passengers} {t.dash.travelersCount}
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <MapPin className="h-4 w-4 shrink-0 text-calma-terracotta" />
              <span className="truncate">{booking.to}</span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 pt-5">
            <span className="font-fraunces text-2xl font-semibold text-calma-terracotta">
              {booking.price}
            </span>
            <button
              onClick={onDetails}
              className="inline-flex items-center gap-2 rounded-xl bg-calma-terracotta px-6 py-3.5 text-sm font-bold text-calma-ink shadow-[0_10px_24px_-8px_rgba(210,179,139,.6)] transition-all hover:-translate-y-0.5 hover:bg-calma-terracotta-deep hover:shadow-[0_14px_28px_-8px_rgba(210,179,139,.7)]"
            >
              {t.dash.viewTrip}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
