"use client";
import { useState } from "react";
import { useAdminBookings } from "@/hooks/admin/useAdminBookings";
import { BookingStatsCards } from "@/components/admin/bookings/BookingStatsCards";
import { BookingFilters } from "@/components/admin/bookings/BookingFilters";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { BookingDetailsModal } from "@/components/admin/bookings/BookingDetailsModal";
import { DeleteBookingModal } from "@/components/admin/bookings/DeleteBookingModal";
import type { Booking } from "@/components/admin/bookings/types";

export default function AdminBookings() {
  const {
    bookings,
    stats,
    pagination,
    loading,
    actionLoading,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    page,
    setPage,
    updateStatus,
    deleteBooking,
  } = useAdminBookings();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const handleStatusChange = (id: number, status: string) => {
    updateStatus(id, status, (newStatus) => {
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : prev));
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F2994A] via-[#5E8B63] to-[#D9A441] bg-clip-text text-transparent">
            Manage Bookings
          </h1>
          <p className="text-calma-taupe mt-1">View and manage all bookings</p>
        </div>
      </div>

      <BookingStatsCards stats={stats} />

      <BookingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <BookingsTable
        bookings={bookings}
        loading={loading}
        actionLoading={actionLoading}
        pagination={pagination}
        page={page}
        onPageChange={setPage}
        onViewDetails={(booking) => {
          setSelectedBooking(booking);
          setShowDetailsModal(true);
        }}
        onConfirm={(id) => handleStatusChange(id, "confirmed")}
        onDeleteRequest={setShowDeleteConfirm}
      />

      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          actionLoading={actionLoading}
          onClose={() => setShowDetailsModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}

      {showDeleteConfirm !== null && (
        <DeleteBookingModal
          bookingId={showDeleteConfirm}
          isDeleting={actionLoading === showDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => deleteBooking(showDeleteConfirm, () => setShowDeleteConfirm(null))}
        />
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
