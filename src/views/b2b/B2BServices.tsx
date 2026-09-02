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
  Compass,
  Tag,
  Timer,
  ImageIcon,
  AlignLeft,
} from "lucide-react";
import { ConfirmDialog } from "@/components/b2b/ConfirmDialog";
import { ARTISAN_INTEREST_CATEGORIES } from "@/lib/partners/constants";

// Shared premium field chrome, consistent across every B2B form.
const inputBoxClass =
  "flex h-12 items-center gap-2.5 rounded-xl border border-calma-border bg-white px-3.5 transition-all duration-300 focus-within:border-b2b-teal focus-within:shadow-[0_0_0_4px_rgba(31,92,85,.15)]";
const inputFieldClass =
  "w-full border-none bg-transparent text-[15px] text-calma-ink outline-none placeholder:text-calma-taupe/50";
const selectClass =
  "h-12 w-full rounded-xl border border-calma-border bg-white px-3.5 text-[15px] text-calma-ink outline-none transition-all duration-300 focus:border-b2b-teal focus:shadow-[0_0_0_4px_rgba(31,92,85,.15)]";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-calma-ink";

const EMPTY_FORM = {
  title: "",
  subtitle: "",
  price: "",
  category: ARTISAN_INTEREST_CATEGORIES[0] as string,
  duration: "",
  description: "",
  image: "",
};

interface Service {
  id: number;
  title: string;
  subtitle: string | null;
  price: string;
  category: string | null;
  duration: string | null;
  description: string;
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
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
      <Clock size={11} /> En attente
    </span>
  );
}

export default function B2BServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [editConfirmTarget, setEditConfirmTarget] = useState<Service | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/b2b/services")
      .then((res) => res.json())
      .then((data) => setServices(data.services ?? []))
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

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      title: s.title,
      subtitle: s.subtitle ?? "",
      price: s.price,
      category: s.category ?? ARTISAN_INTEREST_CATEGORIES[0],
      duration: s.duration ?? "",
      description: s.description,
      image: s.image ?? "",
    });
    setModalOpen(true);
  };

  const requestEdit = (s: Service) => {
    if (s.submissionStatus === "approved") {
      setEditConfirmTarget(s);
    } else {
      openEdit(s);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const url = editing ? `/api/b2b/services/${editing.id}` : "/api/b2b/services";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subtitle: form.subtitle || null,
          duration: form.duration || null,
          image: form.image || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur lors de l'enregistrement");
      }

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
    await fetch(`/api/b2b/services/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Mes services</h1>
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

      {!loading && services.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-calma-border bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-b2b-teal/10">
            <Compass className="h-7 w-7 text-b2b-teal" />
          </div>
          <h2 className="mb-1.5 font-fraunces text-lg font-normal text-calma-ink">
            Vous n&apos;avez pas encore de service
          </h2>
          <p className="mx-auto mb-5 max-w-sm text-sm text-calma-taupe">
            Ajoutez un transport, une excursion ou une activité pour la proposer aux voyageurs Calma
            Trip. Elle sera visible une fois validée par notre équipe.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-b2b-teal px-5 py-2.5 font-medium text-white transition-shadow hover:shadow-lg"
          >
            <Plus className="h-4 w-4" /> Ajouter mon premier service
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-calma-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-calma-border text-left text-calma-taupe">
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium">Prix</th>
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
                ) : (
                  services.map((s) => (
                    <tr key={s.id} className="border-b border-calma-border hover:bg-calma-sand/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-calma-sand">
                            {s.image ? (
                              <Image
                                src={s.image}
                                alt={s.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Compass className="h-4 w-4 text-calma-taupe/40" />
                              </div>
                            )}
                          </div>
                          <span className="line-clamp-1 font-medium text-calma-ink">{s.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-calma-taupe">{s.category ?? "—"}</td>
                      <td className="px-4 py-3 font-medium text-calma-ink">{s.price}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.submissionStatus} />
                        {s.submissionStatus === "rejected" && s.rejectionReason && (
                          <p className="mt-1 max-w-[200px] text-xs text-red-600">
                            {s.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => requestEdit(s)}
                            aria-label={`Modifier ${s.title}`}
                            className="rounded-lg p-2 text-calma-taupe hover:bg-calma-sand"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(s)}
                            aria-label={`Supprimer ${s.title}`}
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
                  <Compass className="h-5 w-5" />
                </div>
                <h2 className="font-fraunces text-lg font-normal text-calma-ink">
                  {editing ? "Modifier le service" : "Nouveau service"}
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
                    placeholder="ex. Transfert aéroport privé"
                    className={inputFieldClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  Sous-titre <span className="font-normal text-calma-taupe">(optionnel)</span>
                </label>
                <div className={inputBoxClass}>
                  <input
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    className={inputFieldClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Prix (ex. &laquo;80 DT / pers.&raquo;)</label>
                  <div className={inputBoxClass}>
                    <input
                      required
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className={inputFieldClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>
                    Durée <span className="font-normal text-calma-taupe">(optionnel)</span>
                  </label>
                  <div className={inputBoxClass}>
                    <Timer size={18} className="shrink-0 text-b2b-teal" />
                    <input
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      placeholder="ex. 3 heures"
                      className={inputFieldClass}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Catégorie</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={selectClass}
                >
                  {ARTISAN_INTEREST_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
          title="Supprimer ce service ?"
          message={`« ${deleteTarget.title} » sera définitivement supprimé. Cette action est irréversible.`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {editConfirmTarget && (
        <ConfirmDialog
          title="Modifier ce service ?"
          message="Ce service est déjà approuvé. Toute modification le repassera en attente de validation et le masquera du site le temps de la revalidation."
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
