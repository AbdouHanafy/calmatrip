"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Clock,
  Check,
  Package,
  Tag,
  Layers,
  Boxes,
  ImageIcon,
  AlignLeft,
  Infinity as InfinityIcon,
} from "lucide-react";
import { ConfirmDialog } from "@/components/b2b/ConfirmDialog";
import { UNLIMITED_STOCK, isUnlimitedStock } from "@/lib/products";

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
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      <Clock size={11} /> En attente
    </span>
  );
}

// Shared premium field chrome, consistent across every B2B form.
const inputBoxClass =
  "flex h-12 items-center gap-2.5 rounded-xl border border-calma-border bg-white px-3.5 transition-all duration-300 focus-within:border-b2b-teal focus-within:shadow-[0_0_0_4px_rgba(31,92,85,.15)]";
const inputFieldClass =
  "w-full border-none bg-transparent text-[15px] text-calma-ink outline-none placeholder:text-calma-taupe/50";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-calma-ink";

export default function B2BProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [unlimited, setUnlimited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [editConfirmTarget, setEditConfirmTarget] = useState<Product | null>(null);

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
    setUnlimited(false);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    const productUnlimited = isUnlimitedStock(p.stock);
    setUnlimited(productUnlimited);
    setForm({
      name: p.name,
      price: String(p.price),
      category: p.category,
      description: p.description,
      stock: productUnlimited ? "100" : String(p.stock),
      image: p.image ?? "",
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
    });
    setModalOpen(true);
  };

  const requestEdit = (p: Product) => {
    if (p.submissionStatus === "approved") {
      setEditConfirmTarget(p);
    } else {
      openEdit(p);
    }
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
          stock: unlimited ? String(UNLIMITED_STOCK) : form.stock,
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/b2b/products/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Mes produits</h1>
          <p className="text-sm text-calma-taupe">
            Chaque ajout ou modification est soumis à validation.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-b2b-teal px-4 py-2.5 font-medium text-white transition-shadow hover:shadow-lg"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {!loading && products.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-calma-border bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-b2b-teal/10">
            <Package className="h-7 w-7 text-b2b-teal" />
          </div>
          <h2 className="mb-1.5 font-fraunces text-lg font-normal text-calma-ink">
            Vous n&apos;avez pas encore de produit
          </h2>
          <p className="mx-auto mb-5 max-w-sm text-sm text-calma-taupe">
            Ajoutez un article à vendre sur la Marketplace Calma Trip. Il sera visible une fois
            validé par notre équipe.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-b2b-teal px-5 py-2.5 font-medium text-white transition-shadow hover:shadow-lg"
          >
            <Plus className="h-4 w-4" /> Ajouter mon premier produit
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-calma-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-calma-border text-left text-calma-taupe">
                  <th className="px-4 py-3 font-medium">Produit</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium">Prix</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-calma-taupe">
                      Chargement...
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="border-b border-calma-border hover:bg-calma-sand/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-calma-sand">
                            <Image
                              src={p.image || "/placeholder-product.png"}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <span className="line-clamp-1 font-medium text-calma-ink">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize text-calma-taupe">{p.category}</td>
                      <td className="px-4 py-3 font-medium text-calma-ink">
                        {p.price.toFixed(2)} TND
                      </td>
                      <td className="px-4 py-3">
                        {isUnlimitedStock(p.stock) ? (
                          <span className="inline-flex items-center gap-1 text-calma-olive">
                            <InfinityIcon className="h-3.5 w-3.5" /> Illimité
                          </span>
                        ) : (
                          <span
                            className={
                              p.stock <= 5
                                ? "font-semibold text-calma-terracotta"
                                : "text-calma-ink"
                            }
                          >
                            {p.stock}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.submissionStatus} />
                        {p.submissionStatus === "rejected" && p.rejectionReason && (
                          <p className="mt-1 max-w-[200px] text-xs text-red-600">
                            {p.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => requestEdit(p)}
                            aria-label={`Modifier ${p.name}`}
                            className="rounded-lg p-2 text-calma-taupe hover:bg-calma-sand"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            aria-label={`Supprimer ${p.name}`}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
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
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-calma-border bg-white px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-b2b-teal/15 text-b2b-teal">
                  <Package className="h-5 w-5" />
                </div>
                <h2 className="font-fraunces text-lg font-normal text-calma-ink">
                  {editing ? "Modifier le produit" : "Nouveau produit"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Fermer"
                className="rounded-lg p-1.5 text-calma-taupe transition-colors hover:bg-calma-sand hover:text-calma-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 px-6 py-6">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className={labelClass}>Nom du produit</label>
                <div className={inputBoxClass}>
                  <Tag size={18} className="shrink-0 text-b2b-teal" />
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="ex. Tapis berbère fait main"
                    className={inputFieldClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Prix (TND)</label>
                  <div className={inputBoxClass}>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className={inputFieldClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Catégorie</label>
                  <div className={inputBoxClass}>
                    <Layers size={18} className="shrink-0 text-b2b-teal" />
                    <input
                      required
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="ex. Artisanat"
                      className={inputFieldClass}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Stock disponible</label>
                <div className="mb-2.5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUnlimited(false)}
                    className={`flex-1 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                      !unlimited
                        ? "border-b2b-teal bg-b2b-teal/10 text-[var(--color-b2b-teal-deep)]"
                        : "border-calma-border text-calma-taupe hover:border-b2b-teal/40"
                    }`}
                  >
                    Quantité définie
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnlimited(true)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                      unlimited
                        ? "border-b2b-teal bg-b2b-teal/10 text-[var(--color-b2b-teal-deep)]"
                        : "border-calma-border text-calma-taupe hover:border-b2b-teal/40"
                    }`}
                  >
                    <InfinityIcon size={15} /> Illimité
                  </button>
                </div>
                {!unlimited && (
                  <div className={inputBoxClass}>
                    <Boxes size={18} className="shrink-0 text-b2b-teal" />
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className={inputFieldClass}
                    />
                  </div>
                )}
                <p className="mt-1.5 text-xs text-calma-taupe">
                  {unlimited
                    ? "Le produit restera toujours disponible à l'achat."
                    : "Le produit sera masqué automatiquement une fois le stock épuisé."}
                </p>
              </div>

              <div>
                <label className={labelClass}>
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
                          ? "border-b2b-teal bg-b2b-teal/10 text-[var(--color-b2b-teal-deep)]"
                          : "border-calma-border text-calma-taupe hover:border-b2b-teal/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Image (URL) <span className="font-normal text-calma-taupe">(optionnel)</span>
                </label>
                <div className={inputBoxClass}>
                  <ImageIcon size={18} className="shrink-0 text-b2b-teal" />
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                    className={inputFieldClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <div className="flex items-start gap-2.5 rounded-xl border border-calma-border bg-white px-3.5 py-3 transition-all duration-300 focus-within:border-b2b-teal focus-within:shadow-[0_0_0_4px_rgba(31,92,85,.15)]">
                  <AlignLeft size={18} className="mt-0.5 shrink-0 text-b2b-teal" />
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full resize-none border-none bg-transparent text-[15px] text-calma-ink outline-none placeholder:text-calma-taupe/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl py-3.5 font-semibold text-white shadow-[0_14px_30px_-12px_rgba(31,92,85,.55)] transition-shadow hover:shadow-[0_18px_36px_-12px_rgba(31,92,85,.7)] disabled:opacity-60"
                style={{ backgroundColor: "var(--color-b2b-teal-deep)" }}
              >
                {saving
                  ? "Enregistrement..."
                  : editing
                    ? "Enregistrer"
                    : "Soumettre pour validation"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Supprimer ce produit ?"
          message={`« ${deleteTarget.name} » sera définitivement supprimé. Cette action est irréversible.`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {editConfirmTarget && (
        <ConfirmDialog
          title="Modifier ce produit ?"
          message="Ce produit est déjà approuvé. Toute modification le repassera en attente de validation et le masquera du site le temps de la revalidation."
          confirmLabel="Continuer"
          onConfirm={() => {
            openEdit(editConfirmTarget);
            setEditConfirmTarget(null);
          }}
          onCancel={() => setEditConfirmTarget(null)}
        />
      )}
    </div>
  );
}
