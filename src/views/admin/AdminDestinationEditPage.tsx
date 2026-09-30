"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CollectionEditor } from "@/components/admin/collection/CollectionEditor";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";

interface DestinationItem {
  id: number;
  name: string;
  description: string;
  active: boolean;
  _count: { services: number };
}

export default function AdminDestinationEditPage({ id }: { id?: string }) {
  const router = useRouter();
  const [item, setItem] = useState<DestinationItem | null | undefined>(id ? undefined : null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch("/api/admin/destinations")
      .then((res) => res.json())
      .then((all: DestinationItem[]) => {
        const found = Array.isArray(all) ? (all.find((d) => d.id === parseInt(id)) ?? null) : null;
        setItem(found);
        if (found) {
          setName(found.name);
          setDescription(found.description);
          setActive(found.active);
        }
      });
  }, [id]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch(
        item ? `/api/admin/destinations/${item.id}` : "/api/admin/destinations",
        {
          method: item ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), description: description.trim(), active }),
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Save failed");
      }
      if (item) setSaved(true);
      else router.push("/admin/destinations");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    await fetch(`/api/admin/destinations/${item.id}`, { method: "DELETE" });
    router.push("/admin/destinations");
  };

  if (id && item === undefined) {
    return <div className="h-72 animate-pulse rounded-2xl bg-calma-border/40" />;
  }
  if (id && !item) {
    return (
      <div className="rounded-2xl border border-calma-border bg-white p-12 text-center text-calma-taupe">
        Destination not found.
      </div>
    );
  }

  return (
    <>
      <CollectionEditor
        title={item ? item.name : "New destination"}
        subtitle={
          item
            ? `${item._count.services} service(s) linked — link services from each service's edit page`
            : "Add a town or region travellers can pick in the search bar"
        }
        backHref="/admin/destinations"
        backLabel="All destinations"
        onSave={handleSave}
        saving={saving}
        saveLabel={item ? "Save changes" : "Create destination"}
        savedMessage={saved ? "Saved." : null}
        onDeleteRequest={item ? () => setShowDelete(true) : undefined}
        deleteLabel="Delete destination"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="dest-name" className="mb-1.5 block text-sm font-medium text-calma-ink">
            Name <span className="text-admin-gold">*</span>
          </label>
          <input
            id="dest-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Djerba"
            className="w-full rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-calma-taupe">
            Shown as-is in the search bar. Partner listings whose city contains this name also
            appear in its results.
          </p>
        </div>

        <div>
          <label htmlFor="dest-desc" className="mb-1.5 block text-sm font-medium text-calma-ink">
            Description{" "}
            <span className="text-xs font-normal text-calma-taupe">(internal note)</span>
          </label>
          <textarea
            id="dest-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Tunisian Riviera"
            className="w-full resize-none rounded-xl border border-calma-border px-4 py-3 focus:border-admin-gold focus:outline-none"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-calma-border px-4 py-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4 accent-calma-ink"
          />
          <span>
            <span className="block text-sm font-medium text-calma-ink">Show in the search bar</span>
            <span className="block text-xs text-calma-taupe">
              Hidden destinations keep their linked services but can&apos;t be picked by visitors.
            </span>
          </span>
        </label>
      </CollectionEditor>

      {showDelete && item && (
        <DeleteConfirmModal
          itemLabel={item.name}
          isDeleting={saving}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
