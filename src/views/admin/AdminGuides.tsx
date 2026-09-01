"use client";

import { useEffect, useState } from "react";
import { BookOpen, EyeOff } from "lucide-react";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";

interface GuideItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string | null;
  image: string | null;
  active: boolean;
}

export default function AdminGuides() {
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<GuideItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/guides");
    const data = await res.json();
    setGuides(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    setDeleting(true);
    await fetch(`/api/admin/guides/${showDeleteConfirm.id}`, { method: "DELETE" });
    setDeleting(false);
    setShowDeleteConfirm(null);
    load();
  };

  const columns: CollectionColumn<GuideItem>[] = [
    {
      key: "title",
      label: "Guide",
      render: (g) => (
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-calma-ink">{g.title}</span>
            {g.category && (
              <span className="rounded-full bg-admin-navy/10 px-2 py-0.5 text-xs text-admin-navy">
                {g.category}
              </span>
            )}
            {!g.active && (
              <span className="flex items-center gap-1 rounded-full bg-calma-sand px-2 py-0.5 text-xs text-calma-taupe">
                <EyeOff className="h-3 w-3" /> Hidden
              </span>
            )}
          </div>
          <p className="text-xs text-calma-taupe">/guides/{g.slug}</p>
        </div>
      ),
    },
    {
      key: "summary",
      label: "Summary",
      render: (g) => (
        <span className="line-clamp-2 max-w-md text-sm text-calma-taupe">{g.summary}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Practical guides</h1>
        <p className="mt-1 text-calma-taupe">
          {guides.length} guide{guides.length !== 1 ? "s" : ""}
        </p>
      </div>

      <CollectionList
        items={guides}
        getId={(g) => g.id}
        columns={columns}
        loading={loading}
        getRowHref={(g) => `/admin/guides/${g.id}`}
        createHref="/admin/guides/new"
        createLabel="New guide"
        onDeleteRequest={setShowDeleteConfirm}
        emptyIcon={BookOpen}
        emptyTitle="No guides yet"
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
