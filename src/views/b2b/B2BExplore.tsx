"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Clock, Check } from "lucide-react";
import { SingleImageUpload } from "@/components/admin/SingleImageUpload";
import { ConfirmDialog } from "@/components/b2b/ConfirmDialog";
import { AGENCY_EXPLORE_CATEGORIES, STATIC_CITIES } from "@/lib/explore/places";

const CITIES = STATIC_CITIES.filter((c) => c !== "All Cities");

const BUDGETS = [
  { value: 1, label: "€ — Économique" },
  { value: 2, label: "€€ — Modéré" },
  { value: 3, label: "€€€ — Premium" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  city: "",
  address: "",
  price: "",
  budget: 2,
  duration: "",
  openingHours: "",
  image: "",
};

interface ListingItem {
  id: number;
  title: string;
  description: string;
  category: string;
  city: string;
  address: string | null;
  price: string | null;
  budget: number;
  duration: string | null;
  openingHours: string | null;
  image: string | null;
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

export default function B2BExplore() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ListingItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ListingItem | null>(null);
  const [editConfirmTarget, setEditConfirmTarget] = useState<ListingItem | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/b2b/explore")
      .then((res) => res.json())
      .then((data) => setListings(data.listings ?? []))
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

  const openEdit = (l: ListingItem) => {
    setEditing(l);
    setForm({
      title: l.title,
      description: l.description,
      category: l.category,
      city: l.city,
      address: l.address ?? "",
      price: l.price ?? "",
      budget: l.budget,
      duration: l.duration ?? "",
      openingHours: l.openingHours ?? "",
      image: l.image ?? "",
    });
    setModalOpen(true);
  };

  const requestEdit = (l: ListingItem) => {
    if (l.submissionStatus === "approved") {
      setEditConfirmTarget(l);
    } else {
      openEdit(l);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = editing ? `/api/b2b/explore/${editing.id}` : "/api/b2b/explore";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          address: form.address || null,
          price: form.price || null,
          duration: form.duration || null,
          openingHours: form.openingHours || null,
          image: form.image || null,
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
    await fetch(`/api/b2b/explore/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">
            Mes annonces Explore
          </h1>
          <p className="text-sm text-calma-taupe">
            Activités, hôtels et adresses publiées sur la page Explore. Chaque ajout ou modification
            est soumis à validation.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-calma-gold px-4 py-2.5 font-medium text-[#241A12] transition-shadow hover:shadow-lg"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-calma-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-calma-border text-left text-calma-taupe">
                <th className="px-4 py-3 font-medium">Annonce</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-calma-taupe">
                    Chargement...
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-calma-taupe">
                    Aucune annonce pour l&apos;instant
                  </td>
                </tr>
              ) : (
                listings.map((l) => (
                  <tr key={l.id} className="border-b border-calma-border hover:bg-calma-sand/50">
                    <td className="px-4 py-3">
                      <span className="line-clamp-1 font-medium text-calma-ink">{l.title}</span>
                    </td>
                    <td className="px-4 py-3 text-calma-taupe">{l.category}</td>
                    <td className="px-4 py-3 text-calma-taupe">{l.city}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={l.submissionStatus} />
                      {l.submissionStatus === "rejected" && l.rejectionReason && (
                        <p className="mt-1 max-w-[200px] text-xs text-red-600">
                          {l.rejectionReason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => requestEdit(l)}
                          aria-label={`Modifier ${l.title}`}
                          className="rounded-lg p-2 text-calma-taupe hover:bg-calma-sand"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(l)}
                          aria-label={`Supprimer ${l.title}`}
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-calma-ink">
                {editing ? "Modifier l'annonce" : "Nouvelle annonce Explore"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Fermer"
                className="text-calma-taupe hover:text-calma-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-calma-ink">Titre</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-calma-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-calma-ink">
                    Catégorie
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-calma-border bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                  >
                    <option value="" disabled>
                      Choisir
                    </option>
                    {AGENCY_EXPLORE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-calma-ink">Ville</label>
                  <select
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full rounded-xl border border-calma-border bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                  >
                    <option value="" disabled>
                      Choisir
                    </option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-calma-ink">
                  Adresse <span className="font-normal text-calma-taupe">(optionnel)</span>
                </label>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-xl border border-calma-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-calma-ink">
                    Prix <span className="font-normal text-calma-taupe">(optionnel)</span>
                  </label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="ex. 20 TND ou Gratuit"
                    className="w-full rounded-xl border border-calma-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-calma-ink">Budget</label>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                    className="w-full rounded-xl border border-calma-border bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                  >
                    {BUDGETS.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-calma-ink">
                    Durée <span className="font-normal text-calma-taupe">(optionnel)</span>
                  </label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="ex. 2 heures"
                    className="w-full rounded-xl border border-calma-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-calma-ink">
                    Horaires <span className="font-normal text-calma-taupe">(optionnel)</span>
                  </label>
                  <input
                    value={form.openingHours}
                    onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                    placeholder="ex. 9h - 18h"
                    className="w-full rounded-xl border border-calma-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-calma-gold"
                  />
                </div>
              </div>

              <SingleImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Image"
                endpoint="/api/b2b/upload"
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-calma-ink">
                  Description
                </label>
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
          title="Supprimer cette annonce ?"
          message={`« ${deleteTarget.title} » sera définitivement supprimée. Cette action est irréversible.`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {editConfirmTarget && (
        <ConfirmDialog
          title="Modifier cette annonce ?"
          message="Cette annonce est déjà approuvée. Toute modification la repassera en attente de validation et la masquera d'Explore le temps de la revalidation."
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
