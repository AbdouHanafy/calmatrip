import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/components/marketplace/Marketplacecontext";
import type { ImageEntry } from "@/components/admin/products/types";
import { serializeImages } from "@/components/admin/products/types";

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const uploadPendingFiles = async (
    entries: ImageEntry[],
    setImageEntries: (updater: (prev: ImageEntry[]) => ImageEntry[]) => void,
  ): Promise<ImageEntry[]> => {
    const pending = entries.filter((e) => !!e.file);
    if (pending.length === 0) return entries;

    setImageEntries((prev) =>
      prev.map((e) => (e.file ? { ...e, uploading: true, error: undefined } : e)),
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
        prev.map((e) => (e.file ? { ...e, uploading: false, error: msg } : e)),
      );
      throw err;
    }

    let urlIndex = 0;
    const resolved = entries.map((e) => {
      if (!e.file) return e;
      const url = uploadedUrls[urlIndex++] ?? e.url;
      return { id: e.id, url };
    });

    setImageEntries(() => resolved);
    return resolved;
  };

  const saveProduct = async (
    form: {
      name: string;
      price: string;
      category: string;
      description: string;
      stock: string;
      sizes: string[];
    },
    imageEntries: ImageEntry[],
    setImageEntries: (updater: (prev: ImageEntry[]) => ImageEntry[]) => void,
    editingId: number | null,
  ): Promise<{ ok: true } | { ok: false; error: string }> => {
    setSaving(true);
    setError(null);

    try {
      const resolvedImages = await uploadPendingFiles(imageEntries, setImageEntries);
      const imageValue = serializeImages(resolvedImages.map((entry) => entry.url));

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

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

      load();
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Échec de l'enregistrement";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: number) => {
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

  return {
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
  };
}
