"use client";

import { useEffect, useState } from "react";
import { MapPin, ArrowUp, ArrowDown } from "lucide-react";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";

interface DestinationItem {
  id: number;
  name: string;
  description: string;
  order: number;
  active: boolean;
  _count: { services: number };
}

export default function AdminDestinations() {
  const [items, setItems] = useState<DestinationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<DestinationItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/destinations");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const put = (id: number, body: object) =>
    fetch(`/api/admin/destinations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    await fetch(`/api/admin/destinations/${toDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    setToDelete(null);
    load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    // Orders can collide (seeded rows); fall back to the list position.
    const orderA = a.order === b.order ? index : a.order;
    const orderB = a.order === b.order ? target : b.order;
    await Promise.all([put(a.id, { order: orderB }), put(b.id, { order: orderA })]);
    load();
  };

  const toggleActive = async (item: DestinationItem) => {
    setItems((prev) => prev.map((d) => (d.id === item.id ? { ...d, active: !d.active } : d)));
    await put(item.id, { active: !item.active });
  };

  const activeCount = items.filter((d) => d.active).length;

  const columns: CollectionColumn<DestinationItem>[] = [
    {
      key: "order",
      label: "Order",
      render: (d) => {
        const index = items.findIndex((x) => x.id === d.id);
        return (
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                move(index, -1);
              }}
              disabled={index === 0}
              aria-label="Move up"
              className="rounded-lg p-1.5 text-calma-taupe transition-colors hover:bg-calma-sand disabled:opacity-30"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                move(index, 1);
              }}
              disabled={index === items.length - 1}
              aria-label="Move down"
              className="rounded-lg p-1.5 text-calma-taupe transition-colors hover:bg-calma-sand disabled:opacity-30"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
    {
      key: "name",
      label: "Destination",
      render: (d) => <span className="font-semibold text-calma-ink">{d.name}</span>,
    },
    {
      key: "services",
      label: "Linked services",
      render: (d) => <span className="text-sm text-calma-taupe">{d._count.services}</span>,
    },
    {
      key: "active",
      label: "In search bar",
      render: (d) => (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleActive(d);
          }}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            d.active
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          {d.active ? "Visible" : "Hidden"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Destinations</h1>
        <p className="mt-1 text-calma-taupe">
          {activeCount} of {items.length} shown in the public search bar. A service with no
          destination is offered in every destination.
        </p>
      </div>

      <CollectionList
        items={items}
        getId={(d) => d.id}
        columns={columns}
        loading={loading}
        getRowHref={(d) => `/admin/destinations/${d.id}`}
        createHref="/admin/destinations/new"
        createLabel="New destination"
        onDeleteRequest={setToDelete}
        emptyIcon={MapPin}
        emptyTitle="No destinations yet"
      />

      {toDelete && (
        <DeleteConfirmModal
          itemLabel={toDelete.name}
          isDeleting={deleting}
          onCancel={() => setToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
