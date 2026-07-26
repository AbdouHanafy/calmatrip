"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Product } from "@/components/marketplace/Marketplacecontext";
import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { ProductFormModal } from "@/components/admin/products/ProductFormModal";
import {
  EMPTY_PRODUCT_FORM,
  parseImages,
  type ProductFormData,
} from "@/components/admin/products/types";
import type { ImageEntry } from "@/components/admin/shared/imageEntry";

export default function AdminProductsPage() {
  const {
    products,
    loading,
    search,
    setSearch,
    saving,
    error,
    setError,
    saveProduct,
    deleteProduct,
    quickStockUpdate,
  } = useAdminProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_PRODUCT_FORM);
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_PRODUCT_FORM);
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
    const existing = parseImages(p.image).map((url) => ({ id: `existing-${url}`, url }));
    setImageEntries(existing);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await saveProduct(form, imageEntries, setImageEntries, editing?.id ?? null);
    if (result.ok) setModalOpen(false);
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

      <ProductsTable
        products={products}
        loading={loading}
        onEdit={openEdit}
        onDelete={deleteProduct}
        onQuickStockUpdate={quickStockUpdate}
      />

      {modalOpen && (
        <ProductFormModal
          isEditing={!!editing}
          form={form}
          onFormChange={setForm}
          imageEntries={imageEntries}
          onImageEntriesChange={setImageEntries}
          saving={saving}
          error={error}
          onClose={() => {
            setModalOpen(false);
            setError(null);
          }}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
