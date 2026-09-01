"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SingleImageUpload } from "@/components/admin/SingleImageUpload";
import { CollectionEditor } from "@/components/admin/collection/CollectionEditor";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";

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

export default function AdminMuseumEditPage({ id }: { id?: string }) {
  const router = useRouter();
  const [museum, setMuseum] = useState<MuseumItem | null | undefined>(id ? undefined : null);
  const [form, setForm] = useState<MuseumForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch("/api/admin/museums")
      .then((res) => res.json())
      .then((all: MuseumItem[]) => {
        const found = Array.isArray(all) ? (all.find((m) => m.id === parseInt(id)) ?? null) : null;
        setMuseum(found);
        if (found) {
          setForm({
            name: found.name,
            description: found.description,
            city: found.city,
            address: found.address ?? "",
            openingHours: found.openingHours ?? "",
            price: found.price ?? "",
            image: found.image ?? "",
            active: found.active,
          });
        }
      });
  }, [id]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.city.trim()) {
      setError("Name, description and city are required.");
      return;
    }
    setSaving(true);
    setSaved(false);
    setError(null);
    const payload = {
      ...form,
      address: form.address || undefined,
      openingHours: form.openingHours || undefined,
      price: form.price || undefined,
      image: form.image || undefined,
    };
    try {
      if (museum) {
        await fetch(`/api/admin/museums/${museum.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setSaved(true);
      } else {
        await fetch("/api/admin/museums", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        router.push("/admin/museums");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!museum) return;
    await fetch(`/api/admin/museums/${museum.id}`, { method: "DELETE" });
    router.push("/admin/museums");
  };

  if (id && museum === undefined) {
    return <div className="h-96 animate-pulse rounded-2xl bg-calma-border/40" />;
  }
  if (id && !museum) {
    return (
      <div className="rounded-2xl border border-calma-border bg-white p-12 text-center text-calma-taupe">
        Museum not found.
      </div>
    );
  }

  return (
    <>
      <CollectionEditor
        title={museum ? museum.name : "New museum"}
        subtitle={museum ? "Edit this museum" : "Add a museum to Explore"}
        backHref="/admin/museums"
        backLabel="All museums"
        onSave={handleSave}
        saving={saving}
        saveLabel={museum ? "Save changes" : "Create museum"}
        savedMessage={saved ? "Saved." : null}
        onDeleteRequest={museum ? () => setShowDelete(true) : undefined}
        deleteLabel="Delete museum"
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
            Name <span className="text-admin-gold">*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Musée du Bardo"
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
            <label className="mb-1.5 block text-sm font-medium text-calma-ink">Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-calma-ink">Opening hours</label>
            <input
              value={form.openingHours}
              onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
              placeholder="9h-17h, fermé lundi"
              className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-calma-ink">Price</label>
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="10 TND"
              className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
            />
          </div>
        </div>

        <SingleImageUpload
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
        />
      </CollectionEditor>

      {showDelete && museum && (
        <DeleteConfirmModal
          itemLabel={museum.name}
          isDeleting={saving}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
