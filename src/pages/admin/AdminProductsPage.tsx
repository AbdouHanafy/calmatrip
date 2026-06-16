'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { Product } from "@/components/marketplace/Marketplacecontext";

const EMPTY_FORM = {
  name: "",
  price: "",
  category: "",
  image: "",
  description: "",
  stock: "100",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      price: String(p.price),
      category: p.category,
      image: p.image,
      description: p.description,
      stock: String(p.stock),
    });
    setModalOpen(true);
  };

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    let imageUrl = form.image;

    if (imageFile) {
      const fd = new FormData();
      fd.append("files", imageFile);

      const uploadRes = await fetch(
        "/api/admin/upload",
        {
          method: "POST",
          body: fd,
        }
      );

      const uploadData =
        await uploadRes.json();

      if (!uploadRes.ok)
        throw new Error(
          uploadData.error || "Upload failed"
        );

      imageUrl =
        uploadData.urls?.[0] || "";
    }

    const url = editing
      ? `/api/products/${editing.id}`
      : "/api/products";

    const method = editing
      ? "PUT"
      : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        ...form,
        image: imageUrl,
      }),
    });

    if (!res.ok)
      throw new Error("Erreur");

    setModalOpen(false);
    load();
  } catch (err) {
    console.error(err);
    alert("Échec de l'enregistrement");
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
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-sm text-gray-500">Gère ton catalogue et le stock</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white font-medium hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">Produit</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Chargement...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucun produit</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg bg-gray-50 overflow-hidden shrink-0">
<Image
  src={
    p.image &&
    (p.image.startsWith("/") ||
      p.image.startsWith("http"))
      ? p.image
      : "/placeholder-product.png"
  }
  alt={p.name}
  fill
  className="object-cover"
  sizes="40px"
/>                      </div>
                      <span className="font-medium text-gray-900 line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{p.category}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{p.price.toFixed(2)} TND</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={p.stock}
                      onBlur={(e) => {
                        const v = parseInt(e.target.value);
                        if (!isNaN(v) && v !== p.stock) quickStockUpdate(p.id, v);
                      }}
                      className={`w-20 px-2 py-1 rounded-lg border text-sm ${
                        p.stock <= 5 ? "border-red-300 text-red-600 bg-red-50" : "border-gray-200"
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{editing ? "Modifier le produit" : "Nouveau produit"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Nom</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Prix (TND)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Stock</label>
                  <input
                    required
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Catégorie</label>
                <input
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Image (URL)</label>
                <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setImageFile(
      e.target.files?.[0] || null
    )
  }
/>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white font-semibold disabled:opacity-60 hover:shadow-lg transition-shadow"
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