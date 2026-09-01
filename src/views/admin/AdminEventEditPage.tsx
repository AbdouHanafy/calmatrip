"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SingleImageUpload } from "@/components/admin/SingleImageUpload";
import { CollectionEditor } from "@/components/admin/collection/CollectionEditor";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";

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

export default function AdminEventEditPage({ id }: { id?: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<EventItem | null | undefined>(id ? undefined : null);
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch("/api/admin/events")
      .then((res) => res.json())
      .then((all: EventItem[]) => {
        const found = Array.isArray(all) ? (all.find((e) => e.id === parseInt(id)) ?? null) : null;
        setEvent(found);
        if (found) {
          setForm({
            title: found.title,
            description: found.description,
            city: found.city,
            address: found.address ?? "",
            startDate: found.startDate.slice(0, 10),
            endDate: found.endDate ? found.endDate.slice(0, 10) : "",
            price: found.price ?? "",
            category: found.category ?? "",
            image: found.image ?? "",
            active: found.active,
          });
        }
      });
  }, [id]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.city.trim() || !form.startDate) {
      setError("Title, description, city and start date are required.");
      return;
    }
    setSaving(true);
    setSaved(false);
    setError(null);
    const payload = {
      ...form,
      address: form.address || undefined,
      endDate: form.endDate || null,
      price: form.price || undefined,
      category: form.category || undefined,
      image: form.image || undefined,
    };
    try {
      if (event) {
        await fetch(`/api/admin/events/${event.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setSaved(true);
      } else {
        await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        router.push("/admin/events");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    await fetch(`/api/admin/events/${event.id}`, { method: "DELETE" });
    router.push("/admin/events");
  };

  if (id && event === undefined) {
    return <div className="h-96 animate-pulse rounded-2xl bg-calma-border/40" />;
  }
  if (id && !event) {
    return (
      <div className="rounded-2xl border border-calma-border bg-white p-12 text-center text-calma-taupe">
        Event not found.
      </div>
    );
  }

  return (
    <>
      <CollectionEditor
        title={event ? event.title : "New event"}
        subtitle={event ? "Edit this event" : "Add an event to Explore"}
        backHref="/admin/events"
        backLabel="All events"
        onSave={handleSave}
        saving={saving}
        saveLabel={event ? "Save changes" : "Create event"}
        savedMessage={saved ? "Saved." : null}
        onDeleteRequest={event ? () => setShowDelete(true) : undefined}
        deleteLabel="Delete event"
        statusFields={[
          {
            label: "Visibility",
            value: form.active ? "active" : "hidden",
            options: [
              { value: "active", label: "Visible publicly" },
              { value: "hidden", label: "Hidden" },
            ],
            onChange: (v) => setForm((f) => ({ ...f, active: v === "active" })),
          },
        ]}
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">
            Title <span className="text-admin-gold">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Festival International de Carthage"
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">
            Description <span className="text-admin-gold">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full resize-none rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-calma-ink">
              City <span className="text-admin-gold">*</span>
            </label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-calma-ink">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Festival, Concert..."
              className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">Address</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-calma-ink">
              Start date <span className="text-admin-gold">*</span>
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-calma-ink">End date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-calma-ink">Price</label>
          <input
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Gratuit, 20 TND..."
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <SingleImageUpload
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
        />
      </CollectionEditor>

      {showDelete && event && (
        <DeleteConfirmModal
          itemLabel={event.title}
          isDeleting={saving}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
