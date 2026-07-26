"use client";
import { useState } from "react";
import { Plus, X, AlertCircle, Loader2 } from "lucide-react";
import { useServices } from "@/hooks/admin/useServices";
import { ServiceStatsCards } from "@/components/admin/services/ServiceStatsCards";
import { ServiceFilters } from "@/components/admin/services/ServiceFilters";
import { ServiceTable } from "@/components/admin/services/ServiceTable";
import { ServiceFormModal } from "@/components/admin/services/ServiceFormModal";
import { DeleteServiceModal } from "@/components/admin/services/DeleteServiceModal";
import {
  emptyServiceForm,
  parseFeatures,
  parseImages,
  type ImageEntry,
  type Service,
  type ServiceFormData,
} from "@/components/admin/services/types";

export default function AdminServices() {
  const {
    services,
    loading,
    saving,
    error,
    setError,
    saveService,
    toggleServiceStatus,
    togglePopular,
    deleteService,
  } = useServices();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(emptyServiceForm);
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setFormData(emptyServiceForm);
    setImageEntries([]);
    setEditingService(null);
    setShowAddModal(true);
  };

  const openEditModal = (service: Service) => {
    setFormData({
      title: service.title,
      subtitle: service.subtitle ?? "",
      description: service.description,
      price: service.price,
      category: service.category ?? "Transport",
      duration: service.duration ?? "",
      active: service.active,
      popular: service.popular,
      features: parseFeatures(service.features),
    });
    const existing = parseImages(service.image).map((url) => ({
      id: `existing-${url}`,
      url,
    }));
    setImageEntries(existing);
    setEditingService(service);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingService(null);
    setFormData(emptyServiceForm);
    setImageEntries([]);
    setError(null);
  };

  const handleSave = async () => {
    const result = await saveService(
      formData,
      imageEntries,
      setImageEntries,
      editingService?.id ?? null,
    );
    if (result.ok) closeModal();
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F2994A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <button
            onClick={() => setError(null)}
            aria-label="Fermer"
            className="p-1 hover:bg-red-100 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F2994A] via-[#5E8B63] to-[#D9A441] bg-clip-text text-transparent">
            Manage Services
          </h1>
          <p className="text-calma-taupe mt-1">Add, modify or manage your services</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F2994A] to-[#5E8B63] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#F2994A]/30 transform hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          New Service
        </button>
      </div>

      <ServiceStatsCards services={services} />

      <ServiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onExportCsv={exportCsv}
      />

      <ServiceTable
        services={services}
        filteredServices={filteredServices}
        onEdit={openEditModal}
        onDeleteRequest={setShowDeleteConfirm}
        onToggleStatus={toggleServiceStatus}
        onTogglePopular={togglePopular}
      />

      {showAddModal && (
        <ServiceFormModal
          editingService={editingService}
          formData={formData}
          onFormDataChange={setFormData}
          imageEntries={imageEntries}
          onImageEntriesChange={setImageEntries}
          saving={saving}
          error={error}
          onClose={closeModal}
          onSubmit={handleSave}
        />
      )}

      {showDeleteConfirm !== null && (
        <DeleteServiceModal
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => {
            deleteService(showDeleteConfirm);
            setShowDeleteConfirm(null);
          }}
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
