"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { ImageUploadZone } from "@/components/admin/shared/ImageUploadZone";
import { CollectionEditor } from "@/components/admin/collection/CollectionEditor";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";
import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import {
  AVAILABLE_SIZES,
  EMPTY_PRODUCT_FORM,
  parseImages,
  type ImageEntry,
  type ProductFormData,
} from "@/components/admin/products/types";

export default function AdminProductEditPage({ id }: { id?: string }) {
  const router = useRouter();
  const { products, loading, saving, error, saveProduct, deleteProduct } = useAdminProducts();

  const editingProduct = id ? (products.find((p) => p.id === parseInt(id)) ?? null) : null;

  const [form, setForm] = useState<ProductFormData>(EMPTY_PRODUCT_FORM);
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialized || loading) return;
    if (id && !editingProduct) return;
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        price: String(editingProduct.price),
        category: editingProduct.category,
        description: editingProduct.description,
        stock: String(editingProduct.stock),
        sizes: Array.isArray(editingProduct.sizes) ? editingProduct.sizes : [],
      });
      setImageEntries(
        parseImages(editingProduct.image).map((url) => ({ id: `existing-${url}`, url })),
      );
    }
    setInitialized(true);
  }, [id, editingProduct, loading, initialized]);

  const toggleSize = (size: string) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));

  const handleSave = async () => {
    setSaved(false);
    const result = await saveProduct(
      form,
      imageEntries,
      setImageEntries,
      editingProduct?.id ?? null,
    );
    if (result.ok) {
      if (!editingProduct) router.push("/admin/marketplace/products");
      else setSaved(true);
    }
  };

  const handleDelete = async () => {
    if (!editingProduct) return;
    await deleteProduct(editingProduct.id);
    router.push("/admin/marketplace/products");
  };

  if (id && loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-calma-border/40" />;
  }
  if (id && !editingProduct) {
    return (
      <div className="rounded-2xl border border-calma-border bg-white p-12 text-center text-calma-taupe">
        Product not found.
      </div>
    );
  }

  return (
    <>
      <CollectionEditor
        title={editingProduct ? editingProduct.name : "New product"}
        subtitle={editingProduct ? "Edit this product" : "Add a product to the marketplace"}
        backHref="/admin/marketplace/products"
        backLabel="All products"
        onSave={handleSave}
        saving={saving}
        saveLabel={editingProduct ? "Save changes" : "Create product"}
        savedMessage={saved ? "Saved." : null}
        onDeleteRequest={editingProduct ? () => setShowDelete(true) : undefined}
        deleteLabel="Delete product"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-calma-ink">
            Name <span className="text-admin-gold">*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-calma-ink">
              Price (TND) <span className="text-admin-gold">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
              className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-calma-ink">
              Stock <span className="text-admin-gold">*</span>
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              required
              className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-calma-ink">
            Category <span className="text-admin-gold">*</span>
          </label>
          <input
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            required
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-calma-ink">
            Available sizes <span className="text-xs font-normal text-calma-taupe">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all ${
                  form.sizes.includes(size)
                    ? "border-calma-success bg-calma-success/10 text-calma-success"
                    : "border-calma-border text-calma-taupe hover:border-admin-gold/50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-calma-ink">
            <ImageIcon className="h-4 w-4 text-admin-gold" />
            Images
          </label>
          <ImageUploadZone images={imageEntries} onChange={setImageEntries} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-calma-ink">
            Description <span className="text-admin-gold">*</span>
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
            className="w-full resize-none rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>
      </CollectionEditor>

      {showDelete && editingProduct && (
        <DeleteConfirmModal
          itemLabel={editingProduct.name}
          isDeleting={saving}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
