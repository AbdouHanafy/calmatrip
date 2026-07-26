import {
  Calendar,
  Car,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  Trash2,
  Users,
  MessageCircle,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { whatsappLink, type Booking, type Pagination } from "./types";

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-calma-border animate-pulse rounded-lg" />
        </td>
      ))}
    </tr>
  );
}

interface BookingsTableProps {
  bookings: Booking[];
  loading: boolean;
  actionLoading: number | null;
  pagination: Pagination;
  page: number;
  onPageChange: (page: number) => void;
  onViewDetails: (booking: Booking) => void;
  onConfirm: (id: number) => void;
  onDeleteRequest: (id: number) => void;
}

export function BookingsTable({
  bookings,
  loading,
  actionLoading,
  pagination,
  page,
  onPageChange,
  onViewDetails,
  onConfirm,
  onDeleteRequest,
}: BookingsTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-calma-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-calma-sand to-white border-b border-calma-border">
            <tr>
              {[
                "ID",
                "Client",
                "Service",
                "Date & Time",
                "Route",
                "Price",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold text-calma-taupe uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-calma-sand transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-calma-taupe">#{booking.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-calma-ink">
                        {booking.customerName ?? "—"}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-calma-taupe mt-0.5">
                        <Users className="w-3 h-3" />
                        {booking.passengers} pax
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-[#F2994A]" />
                        <span className="text-sm text-calma-ink">{booking.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1.5 text-calma-taupe">
                        <Calendar className="w-3.5 h-3.5 text-calma-taupe" />
                        {new Date(booking.date).toLocaleDateString("en-GB")}
                      </div>

                      <div className="flex items-center gap-1.5 text-calma-taupe mt-1">
                        <Clock className="w-3.5 h-3.5 text-calma-taupe" />
                        {booking.time}
                      </div>

                      {booking.tripType === "round-trip" && booking.returnDate && (
                        <div className="mt-2 pt-2 border-t border-calma-border">
                          <div className="flex items-center gap-1.5 text-[#5E8B63]">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(booking.returnDate).toLocaleDateString("en-GB")}
                          </div>

                          {booking.returnTime && (
                            <div className="flex items-center gap-1.5 text-[#5E8B63] mt-1">
                              <Clock className="w-3.5 h-3.5" />
                              {booking.returnTime}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm max-w-[180px]">
                      <div className="flex items-center gap-1.5 text-calma-taupe">
                        <MapPin className="w-3.5 h-3.5 text-calma-taupe flex-shrink-0" />
                        <span className="truncate">{booking.fromLocation}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-calma-taupe mt-1 ml-4">
                        <span className="text-calma-taupe">→</span>
                        <span className="truncate">{booking.toLocation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-[#F2994A]">{booking.price ?? "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onViewDetails(booking)}
                          className="p-2 text-calma-taupe hover:text-[#F2994A] hover:bg-[#F2994A]/10 rounded-lg transition-all"
                          title="View details"
                          aria-label="Voir les détails de la réservation"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onConfirm(booking.id)}
                          disabled={booking.status === "confirmed" || actionLoading === booking.id}
                          className="p-2 text-calma-taupe hover:text-[#5E8B63] hover:bg-[#5E8B63]/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Confirm"
                          aria-label="Confirmer la réservation"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRequest(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="p-2 text-calma-taupe hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                          title="Delete"
                          aria-label="Supprimer la réservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a
                          href={whatsappLink(booking.customerPhone, booking.customerName)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {!loading && bookings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-calma-sand flex items-center justify-center">
            <Calendar className="w-10 h-10 text-calma-taupe" />
          </div>
          <p className="text-calma-taupe">No bookings found</p>
          <p className="text-sm text-calma-taupe mt-1">Try changing your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-calma-border flex items-center justify-between">
          <p className="text-sm text-calma-taupe">
            Showing <span className="font-medium">{bookings.length}</span> of{" "}
            <span className="font-medium">{pagination.total}</span> bookings
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              aria-label="Page précédente"
              className="p-2 border border-calma-border rounded-lg hover:bg-calma-sand transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                  p === page
                    ? "bg-[#F2994A]/10 text-[#F2994A]"
                    : "border border-calma-border hover:bg-calma-sand"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => onPageChange(Math.min(pagination.totalPages, page + 1))}
              disabled={page === pagination.totalPages}
              aria-label="Page suivante"
              className="p-2 border border-calma-border rounded-lg hover:bg-calma-sand transition-colors disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
