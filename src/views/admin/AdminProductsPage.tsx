'use client';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, X, Search, ImageIcon,
  Upload, Loader2, GripVertical,
} from "lucide-react";
import { Product } from "@/components/marketplace/Marketplacecontext";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

const EMPTY_FORM = {
  name: "",
  price: "",
  category: "",
  description: "",
  stock: "100",
  sizes: [] as string[],
};

// An image entry — either already uploaded (has url) or pending upload (has file)
type ImageEntry = {
  id: string;
  url: string;
  file?: File;
  uploading?: boolean;
  error?: string;
};

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

  const onDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

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
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDropZone}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-[#F2994A] bg-[#F2994A]/5 scale-[1.01]"
            : "border-calma-border hover:border-[#F2994A] hover:bg-[#F2994A]/5"
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F2994A]/20 to-[#5E8B63]/20 flex items-center justify-center">
          <Upload className="w-6 h-6 text-[#F2994A]" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-calma-ink">
            Drop images here or <span className="text-[#F2994A]">browse</span>
          </p>
          <p className="text-xs text-calma-taupe mt-1">PNG, JPG, WEBP — max 5 MB each</p>
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
                index === 0 ? "border-[#F2994A]" : "border-calma-border"
              } ${dragOverIndex === index && dragItem.current !== index ? "scale-105 border-[#5E8B63]" : ""}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />

              {index === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#F2994A] text-white text-[10px] font-bold rounded-md">
                  Main
                </span>
              )}

              {img.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}

              {img.error && (
                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center p-1">
                  <p className="text-white text-[10px] text-center">{img.error}</p>
                </div>
              )}

              <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-white drop-shadow" />
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-calma-border hover:border-[#F2994A] hover:bg-[#F2994A]/5 flex flex-col items-center justify-center gap-1 transition-all"
          >
            <Plus className="w-5 h-5 text-calma-taupe" />
            <span className="text-[10px] text-calma-taupe">Add more</span>
          </button>
        </div>
      )}

      {images.length > 1 && (
        <p className="text-xs text-calma-taupe flex items-center gap-1">
          <GripVertical className="w-3 h-3" />
          Drag thumbnails to reorder — first image is the main one
        </p>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageEntries([]);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      price: String(p.price),
      category: p.category,
      description: p.description,
      stock: String(p.stock),
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
    });
    const existing = parseImages(p.image).map((url) => ({
      id: `existing-${url}`,
      url,
    }));
    setImageEntries(existing);
    setModalOpen(true);
  };

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  };

  const uploadPendingFiles = async (entries: ImageEntry[]): Promise<ImageEntry[]> => {
    const pending = entries.filter((e) => !!e.file);
    if (pending.length === 0) return entries;

    setImageEntries((prev) =>
      prev.map((e) => (e.file ? { ...e, uploading: true, error: undefined } : e))
    );

    const fd = new FormData();
    pending.forEach((e) => fd.append("files", e.file!));

    let uploadedUrls: string[] = [];
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
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

    let urlIndex = 0;
    const resolved = entries.map((e) => {
      if (!e.file) return e;
      const url = uploadedUrls[urlIndex++] ?? e.url;
      return { id: e.id, url };
    });

    setImageEntries(resolved);
    return resolved;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const resolvedImages = await uploadPendingFiles(imageEntries);
      const imageValue = serializeImages(resolvedImages.map((entry) => entry.url));

      const url = editing ? `/api/products/${editing.id}` : "/api/products";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: imageValue,
          sizes: form.sizes.length > 0 ? form.sizes : null,
        }),
      });

      if (!res.ok) throw new Error("Erreur");

      setModalOpen(false);
      load();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  const quickStockUpdate = async (id: number, stock: number) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-calma-ink">Produits</h1>
          <p className="text-sm text-calma-taupe">Gère ton catalogue et le stock</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F2994A] to-[#5E8B63] text-white font-medium hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-calma-taupe" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-calma-border focus:outline-none focus:ring-2 focus:ring-[#F2994A]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-calma-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-calma-border text-left text-calma-taupe">
              <th className="px-4 py-3 font-medium">Produit</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Tailles</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-calma-taupe">Chargement...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-calma-taupe">Aucun produit</td></tr>
            ) : (
              products.map((p) => {
                const images = parseImages(p.image);
                return (
                  <tr key={p.id} className="border-b border-calma-border hover:bg-calma-sand/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-calma-sand overflow-hidden shrink-0">
                          <Image
                            src={images[0] || "/placeholder-product.png"}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                          {images.length > 1 && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#F2994A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                              +{images.length - 1}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-calma-ink line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-calma-taupe capitalize">{p.category}</td>
                    <td className="px-4 py-3">
                      {Array.isArray(p.sizes) && p.sizes.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {p.sizes.map((s: string) => (
                            <span key={s} className="px-2 py-0.5 rounded-md bg-calma-sand text-calma-taupe text-xs font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-calma-taupe text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-calma-ink font-medium">{p.price.toFixed(2)} TND</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        defaultValue={p.stock}
                        onBlur={(e) => {
                          const v = parseInt(e.target.value);
                          if (!isNaN(v) && v !== p.stock) quickStockUpdate(p.id, v);
                        }}
                        className={`w-20 px-2 py-1 rounded-lg border text-sm ${
                          p.stock <= 5 ? "border-red-300 text-red-600 bg-red-50" : "border-calma-border"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-calma-sand text-calma-taupe">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-calma-ink">{editing ? "Modifier le produit" : "Nouveau produit"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-calma-taupe hover:text-calma-taupe">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-calma-ink block mb-1.5">Nom</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-calma-border focus:outline-none focus:ring-2 focus:ring-[#F2994A]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-calma-ink block mb-1.5">Prix (TND)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-calma-border focus:outline-none focus:ring-2 focus:ring-[#F2994A]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-calma-ink block mb-1.5">Stock</label>
                  <input
                    required
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-calma-border focus:outline-none focus:ring-2 focus:ring-[#F2994A]"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-calma-ink block mb-1.5">Catégorie</label>
                <input
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-calma-border focus:outline-none focus:ring-2 focus:ring-[#F2994A]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-calma-ink block mb-1.5">
                  Tailles disponibles <span className="text-calma-taupe font-normal">(optionnel)</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {AVAILABLE_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                        form.sizes.includes(size)
                          ? "border-[#5E8B63] bg-[#5E8B63]/10 text-[#5E8B63]"
                          : "border-calma-border text-calma-taupe hover:border-[#F2994A]/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-calma-ink mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#F2994A]" />
                  Images
                  <span className="text-xs text-calma-taupe font-normal">(optional — multiple allowed)</span>
                </label>
                <ImageUploadZone images={imageEntries} onChange={setImageEntries} />
              </div>

              <div>
                <label className="text-sm font-medium text-calma-ink block mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-calma-border focus:outline-none focus:ring-2 focus:ring-[#F2994A] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F2994A] to-[#5E8B63] text-white font-semibold disabled:opacity-60 hover:shadow-lg transition-shadow"
              >
                {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Créer le produit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
