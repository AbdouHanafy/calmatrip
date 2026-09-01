"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, EyeOff } from "lucide-react";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
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

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    setDeleting(true);
    await fetch(`/api/admin/events/${showDeleteConfirm.id}`, { method: "DELETE" });
    setDeleting(false);
    setShowDeleteConfirm(null);
    load();
  };

  const columns: CollectionColumn<EventItem>[] = [
    {
      key: "title",
      label: "Event",
      render: (e) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-calma-ink">{e.title}</span>
          {!e.active && (
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
      render: (e) => (
        <span className="flex items-center gap-1.5 text-sm text-calma-taupe">
          <MapPin className="h-3.5 w-3.5" /> {e.city}
        </span>
      ),
    },
    {
      key: "date",
      label: "Start date",
      render: (e) => (
        <span className="flex items-center gap-1.5 text-sm text-calma-taupe">
          <CalendarDays className="h-3.5 w-3.5" />
          {new Date(e.startDate).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (e) => <span className="text-sm text-calma-taupe">{e.category ?? "—"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Events</h1>
        <p className="mt-1 text-calma-taupe">
          {events.length} event{events.length !== 1 ? "s" : ""}
        </p>
      </div>

      <CollectionList
        items={events}
        getId={(e) => e.id}
        columns={columns}
        loading={loading}
        getRowHref={(e) => `/admin/events/${e.id}`}
        createHref="/admin/events/new"
        createLabel="New event"
        onDeleteRequest={setShowDeleteConfirm}
        emptyIcon={CalendarDays}
        emptyTitle="No events yet"
      />

      {showDeleteConfirm && (
        <DeleteConfirmModal
          itemLabel={showDeleteConfirm.title}
          isDeleting={deleting}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
