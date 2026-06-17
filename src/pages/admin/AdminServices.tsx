'use client';
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Edit, Trash2, EyeOff, Search, Download,
  ChevronLeft, ChevronRight, Star, Clock, DollarSign,
  Tag, X, CheckCircle, Loader2, AlertCircle, Filter,
  Upload, ImageIcon, GripVertical,
} from "lucide-react";
import { RichTextEditor } from "../../components/admin/RichTextEditor";

// ─── Types ────────────────────────────────────────────────────────────────────

type Service = {
  id: number;
  title: string;
  subtitle?: string | null;
  description: string;
  price: string;
  active: boolean;
  category: string | null;
  duration?: string | null;
  popular: boolean;
  image?: string | null;
  features?: unknown; 
};

type ServiceFormData = {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  category: string;
  duration: string;
  active: boolean;
  popular: boolean;
  features: string[];
};

const emptyForm: ServiceFormData = {
  title: "",
  subtitle: "",
  description: "",
  price: "",
  category: "Transport",
  duration: "",
  active: true,
  popular: false,
  features: [],
};

// An image entry — either already uploaded (has url) or pending upload (has file)
type ImageEntry = {
  id: string;           // local key for React
  url: string;          // preview URL (blob: or real /uploads/...)
  file?: File;          // present only before upload
  uploading?: boolean;
  error?: string;
};



const categories = ["all", "Transport", "Excursion", "Group"];

function parseFeatures(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((f) => typeof f === "string");
  return [];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as string[];
  } catch {
    // single URL string
  }
  return [raw];
}

function serializeImages(urls: string[]): string | null {
  if (urls.length === 0) return null;
  if (urls.length === 1) return urls[0];
  return JSON.stringify(urls);
}

// ─── Image Upload Zone ────────────────────────────────────────────────────────

interface ImageUploadZoneProps {
  images: ImageEntry[];
  onChange: (images: ImageEntry[]) => void;
}

function ImageUploadZone({ images, onChange }: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const newEntries: ImageEntry[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
      }));
    onChange([...images, ...newEntries]);
  };

  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  // Drag-and-drop from desktop
  const onDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // Reorder drag-and-drop between thumbnails
  const onDragStartThumb = (index: number) => { dragItem.current = index; };
  const onDragEnterThumb = (index: number) => { setDragOverIndex(index); };
  const onDragEndThumb = () => {
    if (dragItem.current === null || dragOverIndex === null || dragItem.current === dragOverIndex) {
      dragItem.current = null;
      setDragOverIndex(null);
      return;
    }
    const reordered = [...images];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverIndex, 0, moved);
    onChange(reordered);
    dragItem.current = null;
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDropZone}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-[#87CEEB] bg-[#87CEEB]/5 scale-[1.01]"
            : "border-gray-200 hover:border-[#87CEEB] hover:bg-[#87CEEB]/5"
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#87CEEB]/20 to-[#4CAF50]/20 flex items-center justify-center">
          <Upload className="w-6 h-6 text-[#87CEEB]" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            Drop images here or <span className="text-[#87CEEB]">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 5 MB each</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => onDragStartThumb(index)}
              onDragEnter={() => onDragEnterThumb(index)}
              onDragEnd={onDragEndThumb}
              onDragOver={(e) => e.preventDefault()}
              className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-grab active:cursor-grabbing ${
                index === 0 ? "border-[#87CEEB]" : "border-gray-200"
              } ${dragOverIndex === index && dragItem.current !== index ? "scale-105 border-[#4CAF50]" : ""}`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />

              {/* Primary badge */}
              {index === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#87CEEB] text-white text-[10px] font-bold rounded-md">
                  Main
                </span>
              )}

              {/* Uploading overlay */}
              {img.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}

              {/* Error overlay */}
              {img.error && (
                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center p-1">
                  <p className="text-white text-[10px] text-center">{img.error}</p>
                </div>
              )}

              {/* Drag handle */}
              <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-white drop-shadow" />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}

          {/* Add more tile */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#87CEEB] hover:bg-[#87CEEB]/5 flex flex-col items-center justify-center gap-1 transition-all"
          >
            <Plus className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">Add more</span>
          </button>
        </div>
      )}

      {images.length > 1 && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <GripVertical className="w-3 h-3" />
          Drag thumbnails to reorder — first image is the main one
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(emptyForm);
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    { label: "Total Services", value: services.length, icon: Tag, gradient: "from-[#87CEEB] to-[#4CAF50]", change: `${services.length} registered` },
    { label: "Active", value: services.filter((s) => s.active).length, icon: CheckCircle, gradient: "from-[#4CAF50] to-[#45A049]", change: "Available" },
    { label: "Inactive", value: services.filter((s) => !s.active).length, icon: EyeOff, gradient: "from-red-500 to-red-600", change: "To reactivate" },
    { label: "Categories", value: new Set(services.map((s) => s.category).filter(Boolean)).size, icon: Filter, gradient: "from-[#FFD700] to-[#FFC107]", change: "Active" },
  ];

  // ── Modal helpers ──────────────────────────────────────────────────────────

 const openAddModal = () => {
  setFormData(emptyForm);
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
    setFormData(emptyForm);
    setImageEntries([]);
    setError(null);
  };

  // ── Upload pending files ───────────────────────────────────────────────────

  const addFeatureRow = () => {
  setFormData((f) => ({ ...f, features: [...f.features, ""] }));
};

const updateFeatureRow = (index: number, value: string) => {
  setFormData((f) => {
    const next = [...f.features];
    next[index] = value;
    return { ...f, features: next };
  });
};

const removeFeatureRow = (index: number) => {
  setFormData((f) => ({ ...f, features: f.features.filter((_, i) => i !== index) }));
};

  const uploadPendingFiles = async (entries: ImageEntry[]): Promise<ImageEntry[]> => {
    const pending = entries.filter((e) => !!e.file);
    if (pending.length === 0) return entries;

    // Mark as uploading
    setImageEntries((prev) =>
      prev.map((e) => (e.file ? { ...e, uploading: true, error: undefined } : e))
    );

    const formData = new FormData();
    pending.forEach((e) => formData.append("files", e.file!));

    let uploadedUrls: string[] = [];
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      uploadedUrls = json.urls as string[];
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setImageEntries((prev) =>
        prev.map((e) => (e.file ? { ...e, uploading: false, error: msg } : e))
      );
      throw err;
    }

    // Replace pending entries with uploaded URLs
    let urlIndex = 0;
    const resolved = entries.map((e) => {
      if (!e.file) return e;
      const url = uploadedUrls[urlIndex++] ?? e.url;
      return { id: e.id, url };
    });

    setImageEntries(resolved);
    return resolved;
  };

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
  if (!formData.title.trim() || !formData.description.trim() || !formData.price.trim()) {
    setError("Please fill in all required fields");
    return;
  }

  setSaving(true);
  setError(null);

  try {
    const resolvedImages = await uploadPendingFiles(imageEntries);
    const imageValue = serializeImages(resolvedImages.map((e) => e.url));

    const cleanedFeatures = formData.features.map((f) => f.trim()).filter((f) => f.length > 0);

    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || null,
      description: formData.description.trim(),
      price: formData.price.trim(),
      category: formData.category,
      duration: formData.duration.trim() || null,
      image: imageValue,
      active: formData.active,
      popular: formData.popular,
      features: cleanedFeatures.length > 0 ? cleanedFeatures : null,
    };

    const url = editingService ? `/api/services/${editingService.id}` : "/api/services";
    const method = editingService ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(editingService ? "Failed to update service" : "Failed to create service");

    await fetchServices();
    closeModal();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to save service");
  } finally {
    setSaving(false);
  }
};

  // ── Quick toggles ──────────────────────────────────────────────────────────

  const toggleServiceStatus = async (service: Service) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !service.active }),
      });
      if (!res.ok) throw new Error();
      setServices((prev) => prev.map((s) => s.id === service.id ? { ...s, active: !s.active } : s));
    } catch {
      setError("Failed to update status");
    }
  };

  const togglePopular = async (service: Service) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ popular: !service.popular }),
      });
      if (!res.ok) throw new Error();
      setServices((prev) => prev.map((s) => s.id === service.id ? { ...s, popular: !s.popular } : s));
    } catch {
      setError("Failed to update popular status");
    }
  };

  const deleteService = async (id: number) => {
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setServices((prev) => prev.filter((s) => s.id !== id));
      setShowDeleteConfirm(null);
    } catch {
      setError("Failed to delete service");
    }
  };

  const exportCsv = () => {
    const headers = ["ID", "Title", "Category", "Price", "Duration", "Active", "Popular"];
    const rows = filteredServices.map((s) => [
      s.id, s.title, s.category ?? "", s.price, s.duration ?? "", s.active ? "Yes" : "No", s.popular ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "services.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#87CEEB]" />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#87CEEB] via-[#4CAF50] to-[#FFD700] bg-clip-text text-transparent">
            Manage Services
          </h1>
          <p className="text-gray-500 mt-1">Add, modify or manage your services</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#87CEEB]/30 transform hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          New Service
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div key={index} className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{stat.change}</span>
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
              placeholder="Search for a service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === "all" ? "All categories" : cat}</option>
              ))}
            </select>
            <button onClick={exportCsv} className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" title="Export CSV">
              <Download className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <tr>
                {["ID", "Service", "Category", "Duration", "Price", "Status", "Popular", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredServices.map((service) => {
                const images = parseImages(service.image);
                return (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-500">#{service.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Image stack */}
                        <div className="relative w-10 h-10 flex-shrink-0">
                          {images.length > 0 ? (
                            <>
                              <img
                                src={images[0]}
                                alt=""
                                className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                              />
                              {images.length > 1 && (
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#87CEEB] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                  +{images.length - 1}
                                </span>
                              )}
                            </>
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#87CEEB]/10 to-[#4CAF50]/10 flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{service.title}</div>
                          <div className="text-xs text-gray-500 max-w-xs truncate">{service.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                        service.category === "Transport" ? "bg-[#87CEEB]/10 text-[#87CEEB]" :
                        service.category === "Excursion" ? "bg-[#FFD700]/10 text-[#856B00]" :
                        "bg-[#4CAF50]/10 text-[#4CAF50]"
                      }`}>
                        {service.category ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        {service.duration || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-semibold text-[#87CEEB]">
                        <DollarSign className="w-3 h-3" />
                        {service.price}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleServiceStatus(service)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          service.active
                            ? "bg-[#4CAF50]/10 text-[#4CAF50] hover:bg-[#4CAF50]/20"
                            : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        }`}
                      >
                        {service.active ? <><CheckCircle className="w-3 h-3 mr-1" />Active</> : <><EyeOff className="w-3 h-3 mr-1" />Inactive</>}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePopular(service)}
                        className={`p-1.5 rounded-lg transition-all ${service.popular ? "text-[#FFD700] bg-[#FFD700]/10" : "text-gray-300 hover:text-[#FFD700] hover:bg-[#FFD700]/10"}`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEditModal(service)} className="p-2 text-gray-500 hover:text-[#87CEEB] hover:bg-[#87CEEB]/10 rounded-lg transition-all" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(service.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500">No services found</p>
            <p className="text-sm text-gray-400 mt-1">
              {services.length === 0 ? "Add your first service to get started" : "Try changing your search"}
            </p>
          </div>
        )}

        {filteredServices.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredServices.length}</span> of{" "}
              <span className="font-medium">{services.length}</span> services
            </p>
            <div className="flex gap-2">
              <button disabled className="p-2 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
              <button className="px-3 py-2 bg-[#87CEEB]/10 text-[#87CEEB] rounded-lg font-medium">1</button>
              <button disabled className="p-2 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] bg-clip-text text-transparent">
                {editingService ? "Edit Service" : "New Service"}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#87CEEB]" />
                  Images
                  <span className="text-xs text-gray-400 font-normal">(optional — multiple allowed)</span>
                </label>
                <ImageUploadZone images={imageEntries} onChange={setImageEntries} />
              </div>

              {/* Title */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Service Name <span className="text-[#87CEEB]">*</span>
  </label>
  <input
    type="text"
    value={formData.title}
    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
    placeholder="Ex: Airport Transfer"
    required
  />
</div>

{/* Subtitle */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Subtitle <span className="text-xs text-gray-400 font-normal">(optional)</span>
  </label>
  <input
    type="text"
    value={formData.subtitle}
    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
    placeholder="Ex: Arrival & Departure"
  />
</div>

{/* Description */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Description <span className="text-[#87CEEB]">*</span>
  </label>
  <RichTextEditor
    value={formData.description}
    onChange={(html) => setFormData({ ...formData, description: html })}
    placeholder="Detailed description of the service..."
    minHeight={180}
  />
</div>

{/* Features */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
    <span>
      Features <span className="text-xs text-gray-400 font-normal">(optional)</span>
    </span>
  </label>
  <div className="space-y-2">
    {formData.features.map((feature, index) => (
      <div key={index} className="flex items-center gap-2">
        <input
          type="text"
          value={feature}
          onChange={(e) => updateFeatureRow(index, e.target.value)}
          placeholder="Ex: Real-time flight tracking"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
        />
        <button
          type="button"
          onClick={() => removeFeatureRow(index)}
          className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={addFeatureRow}
      className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 hover:border-[#87CEEB] hover:bg-[#87CEEB]/5 rounded-xl text-sm text-gray-500 hover:text-[#87CEEB] transition-all w-full justify-center"
    >
      <Plus className="w-4 h-4" />
      Add feature
    </button>
  </div>
</div>

              {/* Category + Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category <span className="text-[#87CEEB]">*</span></label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent bg-white"
                  >
                    <option value="Transport">Transport</option>
                    <option value="Excursion">Excursion</option>
                    <option value="Group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price <span className="text-[#87CEEB]">*</span></label>
                  <input
                    type="text"
                    placeholder="Ex: 50 TND"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  placeholder="Ex: 2 hours"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-all"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="w-4 h-4 text-[#4CAF50] rounded" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.popular} onChange={(e) => setFormData({ ...formData, popular: e.target.checked })} className="w-4 h-4 text-[#FFD700] rounded" />
                  <span className="text-sm text-gray-700">Popular</span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Saving..." : editingService ? "Update" : "Create Service"}
                </button>
                <button type="button" onClick={closeModal} className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm deletion</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this service? This action is irreversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => deleteService(showDeleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">Delete</button>
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