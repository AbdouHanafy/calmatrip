'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Clock, Check } from "lucide-react";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

const EMPTY_FORM = {
  name: "",
  price: "",
  category: "",
  description: "",
  stock: "100",
  image: "",
  sizes: [] as string[],
};

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  image: string | null;
  sizes: string[] | null;
  submissionStatus: string;
  rejectionReason: string | null;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-calma-success/10 px-2.5 py-1 text-xs font-semibold text-calma-success">
        <Check size={11} /> Approuvé
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
        <X size={11} /> Refusé
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-calma-gold/10 px-2.5 py-1 text-xs font-semibold text-[#8A6B2E]">
      <Clock size={11} /> En attente
    </span>
  );
}

export default function B2BProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/b2b/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

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
      description: p.description,
      stock: String(p.stock),
      image: p.image ?? "",
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
    });
    setModalOpen(true);
  };

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = editing ? `/api/b2b/products/${editing.id}` : "/api/b2b/products";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: form.image || null,
          sizes: form.sizes.length > 0 ? form.sizes : null,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");

      setModalOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await fetch(`/api/b2b/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Mes produits</h1>
          <p className="text-sm text-calma-taupe">Chaque ajout ou modification est soumis à validation.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-calma-gold px-4 py-2.5 font-medium text-[#241A12] transition-shadow hover:shadow-lg"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-calma-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-calma-border text-left text-calma-taupe">
              <th className="px-4 py-3 font-medium">Produit</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-calma-taupe">Chargement...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-calma-taupe">Aucun produit pour l&apos;instant</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-calma-border hover:bg-calma-sand/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-calma-sand">
                        <Image src={p.image || "/placeholder-product.png"} alt={p.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <span className="line-clamp-1 font-medium text-calma-ink">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-calma-taupe">{p.category}</td>
                  <td className="px-4 py-3 font-medium text-calma-ink">{p.price.toFixed(2)} TND</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.submissionStatus} />
                    {p.submissionStatus === "rejected" && p.rejectionReason && (
                      <p className="mt-1 max-w-[200px] text-xs text-red-600">{p.rejectionReason}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-calma-taupe hover:bg-calma-sand">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-calma-ink">{editing ? "Modifier le produit" : "Nouveau produit"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-calma-taupe hover:text-calma-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-calma-ink">Nom</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-calma-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-calma-ink">Prix (TND)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-calma-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-calma-ink">Stock</label>
                  <input
                    required
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-xl border border-calma-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-calma-ink">Catégorie</label>
                <input
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-calma-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-calma-ink">
                  Tailles <span className="font-normal text-calma-taupe">(optionnel)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all ${
                        form.sizes.includes(size)
                          ? "border-calma-gold bg-calma-gold/10 text-[#8A6B2E]"
                          : "border-calma-border text-calma-taupe hover:border-calma-gold/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-calma-ink">
                  Image (URL) <span className="font-normal text-calma-taupe">(optionnel)</span>
                </label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-calma-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-calma-ink">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-calma-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-calma-gold py-3 font-semibold text-[#241A12] transition-shadow hover:shadow-lg disabled:opacity-60"
              >
                {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Soumettre pour validation"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
