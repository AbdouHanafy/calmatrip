"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Clock,
  Check,
  MapPin,
  MapPinned,
  Tag,
  Timer,
  CalendarClock,
  Users,
  AlignLeft,
} from "lucide-react";
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
  capacity: "",
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
  capacity: number | null;
  image: string | null;
  submissionStatus: string;
  rejectionReason: string | null;
}

// Shared premium field chrome, consistent across every B2B form.
const inputBoxClass =
  "flex h-12 items-center gap-2.5 rounded-xl border border-calma-border bg-white px-3.5 transition-all duration-300 focus-within:border-b2b-teal focus-within:shadow-[0_0_0_4px_rgba(31,92,85,.15)]";
const inputFieldClass =
  "w-full border-none bg-transparent text-[15px] text-calma-ink outline-none placeholder:text-calma-taupe/50";
const selectClass =
  "h-12 w-full rounded-xl border border-calma-border bg-white px-3.5 text-[15px] text-calma-ink outline-none transition-all duration-300 focus:border-b2b-teal focus:shadow-[0_0_0_4px_rgba(31,92,85,.15)]";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-calma-ink";

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
      capacity: l.capacity !== null ? String(l.capacity) : "",
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
          className="flex items-center gap-2 rounded-xl bg-b2b-teal px-4 py-2.5 font-medium text-white transition-shadow hover:shadow-lg"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {!loading && listings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-calma-border bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-b2b-teal/10">
            <MapPin className="h-7 w-7 text-b2b-teal" />
          </div>
          <h2 className="mb-1.5 font-fraunces text-lg font-normal text-calma-ink">
            Vous n&apos;avez pas encore d&apos;annonce
          </h2>
          <p className="mx-auto mb-5 max-w-sm text-sm text-calma-taupe">
            Publiez une activité, un restaurant ou une adresse à découvrir sur la page Explore. Elle
            sera visible une fois validée par notre équipe.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-b2b-teal px-5 py-2.5 font-medium text-white transition-shadow hover:shadow-lg"
          >
            <Plus className="h-4 w-4" /> Publier ma première annonce
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-calma-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-calma-border text-left text-calma-taupe">
                  <th className="px-4 py-3 font-medium">Annonce</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium">Ville</th>
                  <th className="px-4 py-3 font-medium">Places</th>
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
                  listings.map((l) => (
                    <tr key={l.id} className="border-b border-calma-border hover:bg-calma-sand/50">
                      <td className="px-4 py-3">
                        <span className="line-clamp-1 font-medium text-calma-ink">{l.title}</span>
                      </td>
                      <td className="px-4 py-3 text-calma-taupe">{l.category}</td>
                      <td className="px-4 py-3 text-calma-taupe">{l.city}</td>
                      <td className="px-4 py-3 text-calma-taupe">
                        {l.capacity !== null ? (
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-calma-olive" /> {l.capacity}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
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
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-calma-border bg-white px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-b2b-teal/15 text-b2b-teal">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="font-fraunces text-lg font-normal text-calma-ink">
                  {editing ? "Modifier l'annonce" : "Nouvelle annonce Explore"}
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
                <label className={labelClass}>Titre</label>
                <div className={inputBoxClass}>
                  <Tag size={18} className="shrink-0 text-b2b-teal" />
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="ex. Balade en calèche à Sidi Bou Saïd"
                    className={inputFieldClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Catégorie</label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={selectClass}
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
                  <label className={labelClass}>Ville</label>
                  <select
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={selectClass}
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
                <label className={labelClass}>
                  Adresse <span className="font-normal text-calma-taupe">(optionnel)</span>
                </label>
                <div className={inputBoxClass}>
                  <MapPinned size={18} className="shrink-0 text-b2b-teal" />
                  <input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={inputFieldClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Prix <span className="font-normal text-calma-taupe">(optionnel)</span>
                  </label>
                  <div className={inputBoxClass}>
                    <input
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="ex. 20 TND ou Gratuit"
                      className={inputFieldClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Budget</label>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                    className={selectClass}
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
                  <label className={labelClass}>
                    Durée <span className="font-normal text-calma-taupe">(optionnel)</span>
                  </label>
                  <div className={inputBoxClass}>
                    <Timer size={18} className="shrink-0 text-b2b-teal" />
                    <input
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      placeholder="ex. 2 heures"
                      className={inputFieldClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>
                    Horaires <span className="font-normal text-calma-taupe">(optionnel)</span>
                  </label>
                  <div className={inputBoxClass}>
                    <CalendarClock size={18} className="shrink-0 text-b2b-teal" />
                    <input
                      value={form.openingHours}
                      onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                      placeholder="ex. 9h - 18h"
                      className={inputFieldClass}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Nombre de places{" "}
                  <span className="font-normal text-calma-taupe">
                    (optionnel — capacité maximale par créneau)
                  </span>
                </label>
                <div className={inputBoxClass}>
                  <Users size={18} className="shrink-0 text-b2b-teal" />
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    placeholder="ex. 12"
                    className={inputFieldClass}
                  />
                </div>
                <p className="mt-1.5 text-xs text-calma-taupe">
                  Laissez vide si l&apos;activité n&apos;a pas de limite de participants.
                </p>
              </div>

              <div>
                <label className={labelClass}>Image</label>
                <SingleImageUpload
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  label="Image"
                  endpoint="/api/b2b/upload"
                />
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
