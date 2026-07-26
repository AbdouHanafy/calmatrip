"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import { useAdminClients } from "@/hooks/admin/useAdminClients";
import { ClientStatsCards } from "@/components/admin/clients/ClientStatsCards";
import { ClientFilters } from "@/components/admin/clients/ClientFilters";
import { ClientsTable } from "@/components/admin/clients/ClientsTable";
import { ClientDetailsModal } from "@/components/admin/clients/ClientDetailsModal";
import type { Client } from "@/components/admin/clients/types";

export default function AdminClients() {
  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    clients,
    dashboardStats,
    toggleClientStatus,
    exportClients,
  } = useAdminClients();

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F2994A] via-[#5E8B63] to-[#D9A441] bg-clip-text text-transparent">
            Manage Clients
          </h1>
          <p className="text-calma-taupe mt-1">View and manage your clients</p>
        </div>
        <button
          onClick={exportClients}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F2994A] to-[#5E8B63] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#F2994A]/30 transform hover:scale-105 transition-all duration-300"
        >
          <Download className="w-5 h-5" />
          Export Data
        </button>
      </div>

      <ClientStatsCards dashboardStats={dashboardStats} />

      <ClientFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <ClientsTable
        clients={clients}
        onViewDetails={(client) => {
          setSelectedClient(client);
          setShowDetailsModal(true);
        }}
        onToggleStatus={toggleClientStatus}
      />

      {showDetailsModal && selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={() => setShowDetailsModal(false)}
          onToggleStatus={toggleClientStatus}
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
