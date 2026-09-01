"use client";
import { useState } from "react";
import { Loader2, Package, Star } from "lucide-react";
import { useServices } from "@/hooks/admin/useServices";
import { ServiceStatsCards } from "@/components/admin/services/ServiceStatsCards";
import { ServiceFilters } from "@/components/admin/services/ServiceFilters";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";
import type { Service } from "@/components/admin/services/types";

export default function AdminServices() {
  const { services, loading, saving, deleteService } = useServices();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Service | null>(null);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const exportCsv = () => {
    const headers = ["ID", "Title", "Category", "Price", "Duration", "Active", "Popular"];
    const rows = filteredServices.map((s) => [
      s.id,
      s.title,
      s.category ?? "",
      s.price,
      s.duration ?? "",
      s.active ? "Yes" : "No",
      s.popular ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "services.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: CollectionColumn<Service>[] = [
    {
      key: "title",
      label: "Service",
      render: (s) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-calma-ink">{s.title}</span>
          {s.popular && <Star className="h-3.5 w-3.5 fill-admin-gold text-admin-gold" />}
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (s) => <span className="text-sm text-calma-taupe">{s.category ?? "—"}</span>,
    },
    {
      key: "price",
      label: "Price",
      render: (s) => <span className="font-semibold text-admin-gold">{s.price}</span>,
    },
    {
      key: "duration",
      label: "Duration",
      render: (s) => <span className="text-sm text-calma-taupe">{s.duration ?? "—"}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (s) => (
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
            s.active
              ? "border-calma-success/20 bg-calma-success/10 text-calma-success"
              : "border-calma-taupe/20 bg-calma-taupe/10 text-calma-taupe"
          }`}
        >
          {s.active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-admin-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Services</h1>
        <p className="mt-1 text-calma-taupe">Manage the public service catalog</p>
      </div>

      <ServiceStatsCards services={services} />

      <ServiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onExportCsv={exportCsv}
      />

      <CollectionList
        items={filteredServices}
        getId={(s) => s.id}
        columns={columns}
        getRowHref={(s) => `/admin/services/${s.id}`}
        createHref="/admin/services/new"
        createLabel="New service"
        onDeleteRequest={setShowDeleteConfirm}
        emptyIcon={Package}
        emptyTitle="No services found"
        emptySub="Try changing your search or filters."
      />

      {showDeleteConfirm && (
        <DeleteConfirmModal
          itemLabel={showDeleteConfirm.title}
          isDeleting={saving}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => {
            deleteService(showDeleteConfirm.id);
            setShowDeleteConfirm(null);
          }}
        />
      )}
    </div>
  );
}
