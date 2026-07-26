"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Plus, Pencil, Trash2, X, MapPin, EyeOff } from "lucide-react";
import { SingleImageUpload } from "@/components/admin/SingleImageUpload";

interface EventItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  city: string;
  address: string | null;
  startDate: string;
  endDate: string | null;
  price: string | null;
  category: string | null;
  active: boolean;
}

type EventForm = {
  title: string;
  description: string;
  city: string;
  address: string;
  startDate: string;
  endDate: string;
  price: string;
  category: string;
  image: string;
  active: boolean;
};

const EMPTY_FORM: EventForm = {
  title: "",
  description: "",
  city: "",
  address: "",
  startDate: "",
  endDate: "",
  price: "",
  category: "",
  image: "",
  active: true,
};

function EventModal({
  event,
  onClose,
  onSave,
}: {
  event: EventItem | null;
  onClose: () => void;
  onSave: (data: EventForm) => Promise<void>;
}) {
  const [form, setForm] = useState<EventForm>(
    event
      ? {
          title: event.title,
          description: event.description,
          city: event.city,
          address: event.address ?? "",
          startDate: event.startDate.slice(0, 10),
          endDate: event.endDate ? event.endDate.slice(0, 10) : "",
          price: event.price ?? "",
          category: event.category ?? "",
          image: event.image ?? "",
          active: event.active,
        }
      : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.city.trim() || !form.startDate) {
      setError("Titre, description, ville et date de début requis.");
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
            {event ? "Modifier l'événement" : "Nouvel événement"}
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
            <label className="mb-1 block text-xs font-medium text-calma-taupe">Titre</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              placeholder="Festival International de Carthage"
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
              <label className="mb-1 block text-xs font-medium text-calma-taupe">Catégorie</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Festival, Concert..."
                className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              />
            </div>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-calma-taupe">
                Date de début
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-calma-taupe">
                Date de fin (optionnel)
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-calma-taupe">
              Prix (optionnel)
            </label>
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Gratuit, 20 TND..."
              className="w-full rounded-xl border border-calma-border px-3 py-2 text-sm text-calma-ink focus:border-calma-terracotta focus:outline-none"
            />
          </div>
          <SingleImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
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

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalEvent, setModalEvent] = useState<EventItem | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/events");
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (form: EventForm) => {
    const payload = {
      ...form,
      address: form.address || undefined,
      endDate: form.endDate || null,
      price: form.price || undefined,
      category: form.category || undefined,
      image: form.image || undefined,
    };
    if (modalEvent && modalEvent !== "new") {
      await fetch(`/api/admin/events/${modalEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setModalEvent(null);
    await load();
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer cet événement ?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Événements</h1>
          <p className="mt-1 text-sm text-calma-taupe">
            {events.length} événement{events.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setModalEvent("new")}
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
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-calma-border py-16 text-center text-calma-taupe">
          <CalendarDays className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p>Aucun événement pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-4 rounded-2xl border border-calma-border bg-white p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-calma-ink">{event.title}</p>
                  {!event.active && (
                    <span className="flex items-center gap-1 rounded-full bg-calma-sand px-2 py-0.5 text-xs text-calma-taupe">
                      <EyeOff className="h-3 w-3" /> Masqué
                    </span>
                  )}
                </div>
                <p className="flex items-center gap-1.5 text-xs text-calma-taupe">
                  <MapPin className="h-3 w-3" /> {event.city}
                  <CalendarDays className="ml-2 h-3 w-3" />{" "}
                  {new Date(event.startDate).toLocaleDateString("fr-FR")}
                </p>
                <p className="mt-1.5 text-sm text-calma-taupe line-clamp-2">{event.description}</p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <button
                  onClick={() => setModalEvent(event)}
                  aria-label={`Modifier ${event.title}`}
                  className="rounded-xl bg-calma-sand p-2 text-calma-ink transition-colors hover:bg-calma-border"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(event.id)}
                  aria-label={`Supprimer ${event.title}`}
                  className="rounded-xl bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalEvent && (
        <EventModal
          event={modalEvent === "new" ? null : modalEvent}
          onClose={() => setModalEvent(null)}
          onSave={save}
        />
      )}
    </div>
  );
}
