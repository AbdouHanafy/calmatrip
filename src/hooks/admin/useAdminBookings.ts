import { useCallback, useEffect, useState } from "react";
import type { Booking, BookingStatus, Pagination, Stats } from "@/components/admin/bookings/types";

export function useAdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, confirmed: 0, pending: 0, revenue: 0 });
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);

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

  // Reset to page 1 whenever the search or status filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedStatus]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(fetchBookings, searchTerm ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchBookings, searchTerm]);

  const updateStatus = async (
    id: number,
    status: string,
    onUpdated?: (status: BookingStatus) => void,
  ) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: status as BookingStatus } : b)),
      );
      onUpdated?.(status as BookingStatus);
      fetchBookings();
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteBooking = async (id: number, onDeleted?: () => void) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setBookings((prev) => prev.filter((b) => b.id !== id));
      onDeleted?.();
      fetchBookings();
    } catch {
      alert("Failed to delete booking. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return {
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
  };
}
