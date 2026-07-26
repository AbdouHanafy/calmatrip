import {
  Car,
  Repeat,
  Calendar,
  Clock,
  MapPin,
  User,
  Info,
  Star,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { BookingStatusBadge } from "./BookingStatusBadge";
import type { Booking } from "./types";

export function BookingCard({
  booking,
  past,
  onCancel,
  onDetails,
  onReview,
}: {
  booking: Booking;
  past: boolean;
  onCancel: () => void;
  onDetails: () => void;
  onReview: () => void;
}) {
  const canReview = past && booking.status === "confirmed";

  return (
    <div className="border border-calma-border rounded-xl p-4 md:p-6 hover:shadow-md transition-all duration-300 bg-white">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-calma-terracotta flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-calma-ink">{booking.service}</h3>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  booking.tripType === "round-trip"
                    ? "bg-calma-olive/10 text-calma-olive border-calma-olive/20"
                    : "bg-calma-sand text-calma-taupe border-calma-border"
                }`}
              >
                <Repeat className="w-3 h-3" />
                {booking.tripType === "round-trip" ? "Aller-retour" : "Aller simple"}
              </span>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-calma-taupe">
              <Calendar className="w-4 h-4 mr-2 text-calma-terracotta" />
              <span>
                {new Date(booking.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center text-calma-taupe">
              <Clock className="w-4 h-4 mr-2 text-calma-terracotta" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-start md:col-span-2">
              <MapPin className="w-4 h-4 mr-2 text-calma-terracotta mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-calma-ink">Départ : {booking.from}</div>
                <div className="text-calma-taupe mt-1">Destination : {booking.to}</div>
              </div>
            </div>

            {booking.tripType === "round-trip" && booking.returnDate && (
              <div className="md:col-span-2 mt-2 pt-3 border-t border-dashed border-calma-border">
                <div className="flex items-center gap-2 text-xs font-semibold text-calma-olive mb-2">
                  <Repeat className="w-3.5 h-3.5" />
                  Trajet retour
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center text-calma-taupe">
                    <Calendar className="w-4 h-4 mr-2 text-calma-olive" />
                    <span>
                      {new Date(booking.returnDate).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {booking.returnTime && (
                    <div className="flex items-center text-calma-taupe">
                      <Clock className="w-4 h-4 mr-2 text-calma-olive" />
                      <span>{booking.returnTime}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {(booking.driver || booking.vehicle) && (
            <div className="mt-4 pt-3 border-t border-calma-border flex flex-wrap gap-4 text-xs">
              {booking.driver && (
                <div className="flex items-center gap-1 text-calma-taupe">
                  <User className="w-3 h-3" />
                  <span>Chauffeur : {booking.driver}</span>
                </div>
              )}
              {booking.vehicle && (
                <div className="flex items-center gap-1 text-calma-taupe">
                  <Car className="w-3 h-3" />
                  <span>Véhicule : {booking.vehicle}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-calma-border">
            <button
              onClick={onDetails}
              className="inline-flex items-center gap-1.5 rounded-lg border border-calma-border px-3 py-1.5 text-xs font-semibold text-calma-ink transition-colors hover:border-calma-terracotta/40 hover:text-calma-terracotta"
            >
              <Info className="w-3.5 h-3.5" />
              Détails de l&apos;activité
            </button>

            {canReview && !booking.review && (
              <button
                onClick={onReview}
                className="inline-flex items-center gap-1.5 rounded-lg bg-calma-terracotta/10 px-3 py-1.5 text-xs font-semibold text-calma-terracotta transition-colors hover:bg-calma-terracotta/20"
              >
                <Star className="w-3.5 h-3.5" />
                Laisser un avis
              </button>
            )}

            {booking.review && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-calma-success/10 px-3 py-1.5 text-xs font-semibold text-calma-success">
                <CheckCircle className="w-3.5 h-3.5" />
                Avis envoyé · {booking.review.rating}/5
                {!booking.review.approved && (
                  <span className="text-calma-taupe font-normal">(en validation)</span>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 lg:gap-2">
          <div className="text-xl font-bold text-calma-terracotta">{booking.price}</div>
          {!past && booking.status !== "cancelled" && (
            <button
              onClick={onCancel}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              aria-label="Annuler la réservation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
