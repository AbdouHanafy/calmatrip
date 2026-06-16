'use client';
import { useState, useEffect, useCallback } from "react";
import {
  Calendar, Car, MapPin, Clock, Search, Filter, Download,
  ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle,
  AlertCircle, Trash2, Users, DollarSign, Star, MessageCircle,
  X, Printer, Mail, Phone, User,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";

interface Booking {
  id: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  service: string;
  date: string;
  time: string;
  fromLocation: string;
  toLocation: string;
  status: BookingStatus;
  price: string | null;
  passengers: number;
  specialRequests: string | null;
  driver: string | null;
  vehicle: string | null;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Stats {
  total: number;
  confirmed: number;
  pending: number;
  revenue: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<BookingStatus, { bg: string; text: string; border: string; icon: typeof CheckCircle; label: string }> = {
  confirmed: { bg: "bg-[#4CAF50]/10", text: "text-[#4CAF50]", border: "border-[#4CAF50]/20", icon: CheckCircle, label: "Confirmed" },
  pending:   { bg: "bg-[#FFD700]/10", text: "text-[#856B00]", border: "border-[#FFD700]/20", icon: AlertCircle, label: "Pending" },
  cancelled: { bg: "bg-red-500/10",   text: "text-red-500",   border: "border-red-500/20",   icon: XCircle,     label: "Cancelled" },
  completed: { bg: "bg-[#87CEEB]/10", text: "text-[#4a8fa8]", border: "border-[#87CEEB]/20", icon: CheckCircle, label: "Completed" },
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon className="w-3 h-3 mr-1" />
      {cfg.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 animate-pulse rounded-lg" />
        </td>
      ))}
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, confirmed: 0, pending: 0, revenue: 0 });
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: selectedStatus,
        search: searchTerm,
        page: String(page),
      });
      const res = await fetch(`/api/admin/bookings?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBookings(data.bookings);
      setPagination(data.pagination);
      setStats(data.stats);
    } catch {
      // keep previous data on error
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchTerm, page]);

  // Debounce search
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedStatus]);

  useEffect(() => {
    const t = setTimeout(fetchBookings, searchTerm ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchBookings]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const updateStatus = async (id: number, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: status as BookingStatus } : b))
      );
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev) => prev ? { ...prev, status: status as BookingStatus } : prev);
      }
      // Refresh stats
      fetchBookings();
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteBooking = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setShowDeleteConfirm(null);
      fetchBookings();
    } catch {
      alert("Failed to delete booking. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Stat cards ─────────────────────────────────────────────────────────────

  const statCards = [
    { label: "Total Bookings", value: stats.total, icon: Calendar, gradient: "from-[#87CEEB] to-[#4CAF50]", sub: "all time" },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, gradient: "from-[#4CAF50] to-[#45A049]", sub: "in progress" },
    { label: "Pending", value: stats.pending, icon: AlertCircle, gradient: "from-[#FFD700] to-[#FFC107]", sub: "to process" },
    { label: "Revenue", value: `${stats.revenue.toLocaleString()} TND`, icon: DollarSign, gradient: "from-[#87CEEB] to-[#FFD700]", sub: "confirmed only" },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">
            Manage Bookings
          </h1>
          <p className="text-gray-500 mt-1">View and manage all bookings</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
            <Printer className="w-5 h-5" />
            Print
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <div key={i} className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{stat.sub}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name, email or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent bg-white"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <tr>
                {["ID", "Client", "Service", "Date & Time", "Route", "Price", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-500">#{booking.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{booking.customerName ?? "—"}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Users className="w-3 h-3" />
                          {booking.passengers} pax
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-[#87CEEB]" />
                          <span className="text-sm text-gray-700">{booking.service}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(booking.date).toLocaleDateString("en-GB")}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 mt-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm max-w-[180px]">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{booking.fromLocation}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 mt-1 ml-4">
                          <span className="text-gray-400">→</span>
                          <span className="truncate">{booking.toLocation}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#87CEEB]">{booking.price ?? "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setSelectedBooking(booking); setShowDetailsModal(true); }}
                            className="p-2 text-gray-500 hover:text-[#87CEEB] hover:bg-[#87CEEB]/10 rounded-lg transition-all"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, "confirmed")}
                            disabled={booking.status === "confirmed" || actionLoading === booking.id}
                            className="p-2 text-gray-500 hover:text-[#4CAF50] hover:bg-[#4CAF50]/10 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Confirm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(booking.id)}
                            disabled={actionLoading === booking.id}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <a
  href={`https://wa.me/${(booking.customerPhone ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(
    `Bonjour ${booking.customerName}, concernant votre réservation...`
  )}`}
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
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500">No bookings found</p>
            <p className="text-sm text-gray-400 mt-1">Try changing your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{bookings.length}</span> of{" "}
              <span className="font-medium">{pagination.total}</span> bookings
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    p === page
                      ? "bg-[#87CEEB]/10 text-[#87CEEB]"
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                <p className="text-sm text-gray-500">ID: #{selectedBooking.id}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status banner */}
              <div className={`p-4 rounded-xl ${STATUS_CONFIG[selectedBooking.status].bg} border ${STATUS_CONFIG[selectedBooking.status].border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => { const Icon = STATUS_CONFIG[selectedBooking.status].icon; return <Icon className={`w-6 h-6 ${STATUS_CONFIG[selectedBooking.status].text}`} />; })()}
                    <div>
                      <p className="font-semibold text-gray-900">Status: {STATUS_CONFIG[selectedBooking.status].label}</p>
                      <p className="text-sm text-gray-500">Booked on {new Date(selectedBooking.createdAt).toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                  <select
                    defaultValue={selectedBooking.status}
                    onChange={(e) => updateStatus(selectedBooking.id, e.target.value)}
                    disabled={actionLoading === selectedBooking.id}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white disabled:opacity-50"
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
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#87CEEB]" /> Client Information
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {[
                    { icon: User, value: selectedBooking.customerName },
                    { icon: Mail, value: selectedBooking.customerEmail },
                    { icon: Phone, value: selectedBooking.customerPhone },
                  ].map(({ icon: Icon, value }, i) => value ? (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ) : null)}
                </div>
              </div>

              {/* Service details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#87CEEB]" /> Service Details
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {[
                    ["Service", selectedBooking.service],
                    ["Date", new Date(selectedBooking.date).toLocaleDateString("en-GB")],
                    ["Time", selectedBooking.time],
                    ["Passengers", `${selectedBooking.passengers} people`],
                    ["Price", selectedBooking.price ?? "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className={`text-sm font-semibold ${label === "Price" ? "text-[#87CEEB] text-lg" : "text-gray-900"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#87CEEB]" /> Route
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#4CAF50] mt-2 flex-shrink-0" />
                    <div><p className="text-xs text-gray-500">Departure</p><p className="text-sm text-gray-900">{selectedBooking.fromLocation}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#87CEEB] mt-2 flex-shrink-0" />
                    <div><p className="text-xs text-gray-500">Destination</p><p className="text-sm text-gray-900">{selectedBooking.toLocation}</p></div>
                  </div>
                </div>
              </div>

              {/* Driver & Vehicle */}
              {(selectedBooking.driver || selectedBooking.vehicle) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#FFD700]" /> Driver & Vehicle
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    {selectedBooking.driver && (
                      <div className="flex justify-between"><span className="text-sm text-gray-500">Driver</span><span className="text-sm text-gray-900">{selectedBooking.driver}</span></div>
                    )}
                    {selectedBooking.vehicle && (
                      <div className="flex justify-between"><span className="text-sm text-gray-500">Vehicle</span><span className="text-sm text-gray-900">{selectedBooking.vehicle}</span></div>
                    )}
                  </div>
                </div>
              )}

              {/* Special requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Special Requests</h4>
                  <div className="bg-[#FFD700]/5 rounded-xl p-4 border border-[#FFD700]/20">
                    <p className="text-sm text-gray-700">{selectedBooking.specialRequests}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <a
                  href={`https://wa.me/${(selectedBooking.customerPhone ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Bonjour ${selectedBooking.customerName}, concernant votre réservation...`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> whatsapp
                </a>
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm !== null && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm deletion</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete booking <span className="font-mono font-bold">#{showDeleteConfirm}</span>? This action is irreversible.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteBooking(showDeleteConfirm)}
                  disabled={actionLoading === showDeleteConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {actionLoading === showDeleteConfirm ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}