"use client";
import { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { useAdminBookings } from "@/hooks/admin/useAdminBookings";
import { BookingStatsCards } from "@/components/admin/bookings/BookingStatsCards";
import { BookingFilters } from "@/components/admin/bookings/BookingFilters";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
import { StatusPill } from "@/components/admin/collection/StatusPill";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";
import { STATUS_CONFIG, type Booking } from "@/components/admin/bookings/types";

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
    setPage,
    deleteBooking,
  } = useAdminBookings();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Booking | null>(null);

  const columns: CollectionColumn<Booking>[] = [
    {
      key: "client",
      label: "Client",
      render: (b) => (
        <>
          <div className="font-semibold text-calma-ink">{b.customerName ?? "—"}</div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-calma-taupe">
            <Users className="h-3 w-3" />
            {b.passengers} pax
          </div>
        </>
      ),
    },
    {
      key: "service",
      label: "Service",
      render: (b) => <span className="text-sm text-calma-ink">{b.service}</span>,
    },
    {
      key: "date",
      label: "Date & time",
      render: (b) => (
        <div className="text-sm text-calma-taupe">
          <div>{new Date(b.date).toLocaleDateString("en-GB")}</div>
          <div>{b.time}</div>
        </div>
      ),
    },
    {
      key: "route",
      label: "Route",
      render: (b) => (
        <div className="max-w-[200px] text-sm text-calma-taupe">
          <div className="truncate">{b.fromLocation}</div>
          <div className="truncate">→ {b.toLocation}</div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (b) => <span className="font-semibold text-admin-gold">{b.price ?? "—"}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (b) => <StatusPill config={STATUS_CONFIG[b.status]} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Bookings</h1>
        <p className="mt-1 text-calma-taupe">View and manage all bookings</p>
      </div>

      <BookingStatsCards stats={stats} />

      <BookingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <CollectionList
        items={bookings}
        getId={(b) => b.id}
        columns={columns}
        loading={loading}
        getRowHref={(b) => `/admin/bookings/${b.id}`}
        onDeleteRequest={setShowDeleteConfirm}
        emptyIcon={Calendar}
        emptyTitle="No bookings found"
        emptySub="Try changing your search or filters."
        pagination={pagination}
        onPageChange={setPage}
      />

      {showDeleteConfirm && (
        <DeleteConfirmModal
          itemLabel={`#${showDeleteConfirm.id} — ${showDeleteConfirm.service}`}
          isDeleting={actionLoading === showDeleteConfirm.id}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => deleteBooking(showDeleteConfirm.id, () => setShowDeleteConfirm(null))}
        />
      )}
    </div>
  );
}
