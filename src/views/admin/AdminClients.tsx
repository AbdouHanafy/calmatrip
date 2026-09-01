"use client";
import { Download, Users, Star } from "lucide-react";
import { useAdminClients } from "@/hooks/admin/useAdminClients";
import { ClientStatsCards } from "@/components/admin/clients/ClientStatsCards";
import { ClientFilters } from "@/components/admin/clients/ClientFilters";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
import { getInitials, getStatusBadge, type Client } from "@/components/admin/clients/types";

export default function AdminClients() {
  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    clients,
    dashboardStats,
    exportClients,
  } = useAdminClients();

  const columns: CollectionColumn<Client>[] = [
    {
      key: "client",
      label: "Client",
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-admin-gold/10">
            <span className="text-sm font-bold text-admin-gold">{getInitials(c.name)}</span>
          </div>
          <span className="font-semibold text-calma-ink">{c.name}</span>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",
      render: (c) => (
        <div className="text-xs text-calma-taupe">
          <div>{c.email}</div>
          <div>{c.phone}</div>
        </div>
      ),
    },
    {
      key: "registered",
      label: "Registered",
      render: (c) => (
        <span className="text-sm text-calma-taupe">
          {new Date(c.registeredDate).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      key: "bookings",
      label: "Bookings",
      render: (c) => (
        <div className="flex items-center gap-1.5">
          <span className="rounded-lg bg-admin-navy/10 px-2.5 py-1 text-sm font-semibold text-admin-navy">
            {c.totalBookings}
          </span>
          {c.favoriteService && (
            <span className="flex items-center gap-1 text-xs text-calma-taupe">
              <Star className="h-3 w-3 text-admin-gold" />
              {c.favoriteService}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "spent",
      label: "Total spent",
      render: (c) => (
        <span className="font-semibold text-calma-success">
          {c.totalSpent ? `${c.totalSpent} TND` : "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (c) => {
        const badge = getStatusBadge(c.status);
        const Icon = badge.icon;
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
          >
            <Icon className="h-3 w-3" />
            {badge.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Clients</h1>
          <p className="mt-1 text-calma-taupe">View and manage your clients</p>
        </div>
        <button
          onClick={exportClients}
          className="flex items-center justify-center gap-2 rounded-xl bg-admin-navy px-5 py-2.5 font-semibold text-white transition-colors hover:bg-admin-navy-deep"
        >
          <Download className="h-5 w-5" />
          Export data
        </button>
      </div>

      <ClientStatsCards dashboardStats={dashboardStats} />

      <ClientFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <CollectionList
        items={clients}
        getId={(c) => c.id}
        columns={columns}
        getRowHref={(c) => `/admin/clients/${c.id}`}
        emptyIcon={Users}
        emptyTitle="No clients found"
        emptySub="Try changing your search or filters."
      />
    </div>
  );
}
