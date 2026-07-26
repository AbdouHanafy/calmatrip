"use client";

import { useEffect, useState } from "react";
import { Landmark, Plus, Pencil, Trash2, X, MapPin, EyeOff } from "lucide-react";
import { SingleImageUpload } from "@/components/admin/SingleImageUpload";

interface MuseumItem {
  id: number;
  name: string;
  description: string;
  image: string | null;
  city: string;
  address: string | null;
  openingHours: string | null;
  price: string | null;
  active: boolean;
}

type MuseumForm = {
  name: string;
  description: string;
  city: string;
  address: string;
  openingHours: string;
  price: string;
  image: string;
  active: boolean;
};

const EMPTY_FORM: MuseumForm = {
  name: "",
  description: "",
  city: "",
  address: "",
  openingHours: "",
  price: "",
  image: "",
  active: true,
};

function MuseumModal({
  museum,
  onClose,
  onSave,
}: {
  museum: MuseumItem | null;
  onClose: () => void;
  onSave: (data: MuseumForm) => Promise<void>;
}) {
  const [form, setForm] = useState<MuseumForm>(
    museum
      ? {
          name: museum.name,
          description: museum.description,
          city: museum.city,
          address: museum.address ?? "",
          openingHours: museum.openingHours ?? "",
          price: museum.price ?? "",
          image: museum.image ?? "",
          active: museum.active,
        }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.city.trim()) {
      setError("Nom, description et ville requis.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
    } catch {
      setError("Une erreur est survenue.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-fraunces text-lg text-calma-ink">
            {museum ? "Modifier le musée" : "Nouveau musée"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-1 text-calma-taupe hover:bg-calma-sand"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-calma-taupe">Nom</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              placeholder="Musée du Bardo"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-calma-taupe">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-calma-taupe">Ville</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-calma-taupe">
                Adresse (optionnel)
              </label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-calma-taupe">
                Horaires (optionnel)
              </label>
              <input
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                placeholder="9h-17h, fermé lundi"
                className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-calma-taupe">
                Prix (optionnel)
              </label>
              <input
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="10 TND"
                className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              />
            </div>
          </div>
          <div>
            <SingleImageUpload
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-calma-ink">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="h-4 w-4 rounded border-calma-border"
            />
            Visible publiquement
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={submit}
            disabled={saving}
            className="w-full rounded-xl bg-calma-terracotta py-2.5 text-sm font-semibold text-white transition-colors hover:bg-calma-terracotta-deep disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMuseums() {
  const [museums, setMuseums] = useState<MuseumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMuseum, setModalMuseum] = useState<MuseumItem | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/museums");
    const data = await res.json();
    setMuseums(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (form: MuseumForm) => {
    const payload = {
      ...form,
      address: form.address || undefined,
      openingHours: form.openingHours || undefined,
      price: form.price || undefined,
      image: form.image || undefined,
    };
    if (modalMuseum && modalMuseum !== "new") {
      await fetch(`/api/admin/museums/${modalMuseum.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/museums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setModalMuseum(null);
    await load();
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer ce musée ?")) return;
    await fetch(`/api/admin/museums/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Musées</h1>
          <p className="mt-1 text-sm text-calma-taupe">
            {museums.length} musée{museums.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setModalMuseum("new")}
          className="flex items-center gap-2 rounded-xl bg-calma-terracotta px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-calma-terracotta-deep"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-calma-sand" />
          ))}
        </div>
      ) : museums.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-calma-border py-16 text-center text-calma-taupe">
          <Landmark className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p>Aucun musée pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {museums.map((museum) => (
            <div
              key={museum.id}
              className="flex items-start gap-4 rounded-2xl border border-calma-border bg-white p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-calma-ink">{museum.name}</p>
                  {!museum.active && (
                    <span className="flex items-center gap-1 rounded-full bg-calma-sand px-2 py-0.5 text-xs text-calma-taupe">
                      <EyeOff className="h-3 w-3" /> Masqué
                    </span>
                  )}
                </div>
                <p className="flex items-center gap-1.5 text-xs text-calma-taupe">
                  <MapPin className="h-3 w-3" /> {museum.city}
                  {museum.openingHours && <span className="ml-2">· {museum.openingHours}</span>}
                </p>
                <p className="mt-1.5 text-sm text-calma-taupe line-clamp-2">{museum.description}</p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <button
                  onClick={() => setModalMuseum(museum)}
                  aria-label={`Modifier ${museum.name}`}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-calma-sand text-calma-ink transition-colors hover:bg-calma-border"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(museum.id)}
                  aria-label={`Supprimer ${museum.name}`}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalMuseum && (
        <MuseumModal
          museum={modalMuseum === "new" ? null : modalMuseum}
          onClose={() => setModalMuseum(null)}
          onSave={save}
        />
      )}
    </div>
  );
}
