import { useCallback, useEffect, useState } from "react";
import type { Client, DashboardStats } from "@/components/admin/clients/types";

export function useAdminClients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    blockedClients: 0,
    totalBookings: 0,
  });

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/clients?search=${searchTerm}&status=${selectedStatus}`);
      const data = await res.json();
      if (data.success) setClients(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatus]);

  // Debounce on search/status changes; load immediately on first mount.
  useEffect(() => {
    const timeout = setTimeout(fetchClients, searchTerm ? 500 : 0);
    return () => clearTimeout(timeout);
  }, [fetchClients, searchTerm]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/clients/stats");
      const data = await res.json();
      setDashboardStats(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const toggleClientStatus = async (clientId: string, currentStatus: "active" | "blocked") => {
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus === "active" ? "blocked" : "active" }),
      });
      const data = await res.json();
      if (data.success) fetchClients();
    } catch (error) {
      console.error(error);
    }
  };

  const exportClients = () => {
    window.open("/api/admin/clients/export", "_blank");
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    clients,
    loading,
    dashboardStats,
    toggleClientStatus,
    exportClients,
  };
}
