import { X, User, Mail, Phone, Car, MapPin, Star, MessageCircle, Printer } from "lucide-react";
import { STATUS_CONFIG, whatsappLink, type Booking } from "./types";

interface BookingDetailsModalProps {
  booking: Booking;
  actionLoading: number | null;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
}

export function BookingDetailsModal({
  booking,
  actionLoading,
  onClose,
  onStatusChange,
}: BookingDetailsModalProps) {
  const statusCfg = STATUS_CONFIG[booking.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-calma-border px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-calma-ink">Booking Details</h3>
            <p className="text-sm text-calma-taupe">ID: #{booking.id}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-2 hover:bg-calma-sand rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-calma-taupe" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status banner */}
          <div className={`p-4 rounded-xl ${statusCfg.bg} border ${statusCfg.border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon className={`w-6 h-6 ${statusCfg.text}`} />
                <div>
                  <p className="font-semibold text-calma-ink">Status: {statusCfg.label}</p>
                  <p className="text-sm text-calma-taupe">
                    Booked on {new Date(booking.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
              <select
                defaultValue={booking.status}
                onChange={(e) => onStatusChange(booking.id, e.target.value)}
                disabled={actionLoading === booking.id}
                className="px-3 py-1.5 border border-calma-border rounded-lg text-sm bg-white disabled:opacity-50"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Client */}
          <div>
            <h4 className="text-sm font-semibold text-calma-ink mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#F2994A]" /> Client Information
            </h4>
            <div className="bg-calma-sand rounded-xl p-4 space-y-2">
              {[
                { icon: User, value: booking.customerName },
                { icon: Mail, value: booking.customerEmail },
                { icon: Phone, value: booking.customerPhone },
              ].map(({ icon: Icon, value }, i) =>
                value ? (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Icon className="w-4 h-4 text-calma-taupe" />
                    <span className="text-calma-ink">{value}</span>
                  </div>
                ) : null,
              )}
            </div>
          </div>

          {/* Service details */}
          <div>
            <h4 className="text-sm font-semibold text-calma-ink mb-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-[#F2994A]" /> Service Details
            </h4>
            <div className="bg-calma-sand rounded-xl p-4 space-y-3">
              {[
                ["Service", booking.service],
                ["Date", new Date(booking.date).toLocaleDateString("en-GB")],
                ["Time", booking.time],
                ["Passengers", `${booking.passengers} people`],
                ["Price", booking.price ?? "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-calma-taupe">{label}</span>
                  <span
                    className={`text-sm font-semibold ${label === "Price" ? "text-[#F2994A] text-lg" : "text-calma-ink"}`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {booking.tripType === "round-trip" && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-calma-taupe">Return Date</span>
                <span className="text-sm font-semibold text-calma-ink">
                  {booking.returnDate
                    ? new Date(booking.returnDate).toLocaleDateString("en-GB")
                    : "—"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-calma-taupe">Return Time</span>
                <span className="text-sm font-semibold text-calma-ink">
                  {booking.returnTime ?? "—"}
                </span>
              </div>
            </>
          )}

          {/* Route */}
          <div>
            <h4 className="text-sm font-semibold text-calma-ink mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F2994A]" /> Route
            </h4>
            <div className="bg-calma-sand rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#5E8B63] mt-2 flex-shrink-0" />
                <div>
                  <p className="text-xs text-calma-taupe">Departure</p>
                  <p className="text-sm text-calma-ink">{booking.fromLocation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#F2994A] mt-2 flex-shrink-0" />
                <div>
                  <p className="text-xs text-calma-taupe">Destination</p>
                  <p className="text-sm text-calma-ink">{booking.toLocation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Driver & Vehicle */}
          {(booking.driver || booking.vehicle) && (
            <div>
              <h4 className="text-sm font-semibold text-calma-ink mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D9A441]" /> Driver & Vehicle
              </h4>
              <div className="bg-calma-sand rounded-xl p-4 space-y-2">
                {booking.driver && (
                  <div className="flex justify-between">
                    <span className="text-sm text-calma-taupe">Driver</span>
                    <span className="text-sm text-calma-ink">{booking.driver}</span>
                  </div>
                )}
                {booking.vehicle && (
                  <div className="flex justify-between">
                    <span className="text-sm text-calma-taupe">Vehicle</span>
                    <span className="text-sm text-calma-ink">{booking.vehicle}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Special requests */}
          {booking.specialRequests && (
            <div>
              <h4 className="text-sm font-semibold text-calma-ink mb-3">Special Requests</h4>
              <div className="bg-[#D9A441]/5 rounded-xl p-4 border border-[#D9A441]/20">
                <p className="text-sm text-calma-ink">{booking.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <a
              href={whatsappLink(booking.customerPhone, booking.customerName)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#F2994A] to-[#5E8B63] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> whatsapp
            </a>
            <button
              onClick={() => window.print()}
              className="flex-1 px-4 py-2.5 border-2 border-calma-border text-calma-ink rounded-xl font-semibold hover:bg-calma-sand transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
