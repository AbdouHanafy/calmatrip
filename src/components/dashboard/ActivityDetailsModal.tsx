import Image from "next/image";
import { X, Clock } from "lucide-react";
import { BookingStatusBadge } from "./BookingStatusBadge";
import type { Booking, ServiceInfo } from "./types";

interface ActivityDetailsModalProps {
  booking: Booking;
  info: ServiceInfo | null;
  onClose: () => void;
}

export function ActivityDetailsModal({ booking, info, onClose }: ActivityDetailsModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full animate-scale-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {info?.image && (
          <div className="relative h-44 w-full bg-calma-sand">
            <Image src={info.image} alt={booking.service} fill className="object-cover" />
          </div>
        )}
        <div className="p-6">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold text-calma-ink">{booking.service}</h3>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="text-calma-taupe hover:text-calma-ink"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            <BookingStatusBadge status={booking.status} />
            {info?.category && (
              <span className="rounded-full bg-calma-olive/10 px-3 py-1 text-xs font-semibold text-calma-olive">
                {info.category}
              </span>
            )}
            {info?.duration && (
              <span className="inline-flex items-center gap-1 rounded-full bg-calma-sand px-3 py-1 text-xs font-semibold text-calma-taupe">
                <Clock className="w-3 h-3" />
                {info.duration}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-calma-taupe">
            {info?.description ?? "Détails de l'activité non disponibles pour le moment."}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-calma-sand/60 p-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-calma-taupe">Date</p>
              <p className="font-medium text-calma-ink">
                {new Date(booking.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-calma-taupe">Heure</p>
              <p className="font-medium text-calma-ink">{booking.time}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs uppercase tracking-wide text-calma-taupe">Trajet</p>
              <p className="font-medium text-calma-ink">
                {booking.from} → {booking.to}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
