"use client";

import { useEffect, useState } from "react";
import { Landmark, MapPin, EyeOff } from "lucide-react";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
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

export default function AdminMuseums() {
  const [museums, setMuseums] = useState<MuseumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<MuseumItem | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    setDeleting(true);
    await fetch(`/api/admin/museums/${showDeleteConfirm.id}`, { method: "DELETE" });
    setDeleting(false);
    setShowDeleteConfirm(null);
    load();
  };

  const columns: CollectionColumn<MuseumItem>[] = [
    {
      key: "name",
      label: "Museum",
      render: (m) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-calma-ink">{m.name}</span>
          {!m.active && (
            <span className="flex items-center gap-1 rounded-full bg-calma-sand px-2 py-0.5 text-xs text-calma-taupe">
              <EyeOff className="h-3 w-3" /> Hidden
            </span>
          )}
        </div>
      ),
    },
    {
      key: "city",
      label: "City",
      render: (m) => (
        <span className="flex items-center gap-1.5 text-sm text-calma-taupe">
          <MapPin className="h-3.5 w-3.5" /> {m.city}
        </span>
      ),
    },
    {
      key: "hours",
      label: "Opening hours",
      render: (m) => <span className="text-sm text-calma-taupe">{m.openingHours ?? "—"}</span>,
    },
    {
      key: "price",
      label: "Price",
      render: (m) => <span className="text-sm text-calma-taupe">{m.price ?? "—"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Museums</h1>
        <p className="mt-1 text-calma-taupe">
          {museums.length} museum{museums.length !== 1 ? "s" : ""}
        </p>
      </div>

      <CollectionList
        items={museums}
        getId={(m) => m.id}
        columns={columns}
        loading={loading}
        getRowHref={(m) => `/admin/museums/${m.id}`}
        createHref="/admin/museums/new"
        createLabel="New museum"
        onDeleteRequest={setShowDeleteConfirm}
        emptyIcon={Landmark}
        emptyTitle="No museums yet"
      />

      {showDeleteConfirm && (
        <DeleteConfirmModal
          itemLabel={showDeleteConfirm.name}
          isDeleting={deleting}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
