"use client";

import { useEffect, useState } from "react";
import { Mail, Download } from "lucide-react";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";

interface Subscriber {
  id: number;
  email: string;
  active: boolean;
  createdAt: string;
}

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Subscriber | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/newsletter");
    const data = await res.json();
    setSubscribers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    setDeleting(true);
    await fetch(`/api/admin/newsletter/${showDeleteConfirm.id}`, { method: "DELETE" });
    setDeleting(false);
    setShowDeleteConfirm(null);
    load();
  };

  const exportCsv = () => {
    const rows = [
      "email,inscrit le",
      ...subscribers.map((s) => `${s.email},${new Date(s.createdAt).toLocaleDateString("fr-FR")}`),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));

  const columns: CollectionColumn<Subscriber>[] = [
    {
      key: "email",
      label: "Email",
      render: (s) => <span className="font-medium text-calma-ink">{s.email}</span>,
    },
    {
      key: "date",
      label: "Subscribed on",
      render: (s) => (
        <span className="text-sm text-calma-taupe">
          {new Date(s.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Newsletter</h1>
          <p className="mt-1 text-calma-taupe">
            {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={subscribers.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-admin-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-admin-gold-deep disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <CollectionList
        items={filtered}
        getId={(s) => s.id}
        columns={columns}
        loading={loading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search an email..."
        onDeleteRequest={setShowDeleteConfirm}
        emptyIcon={Mail}
        emptyTitle="No subscribers yet"
      />

      {showDeleteConfirm && (
        <DeleteConfirmModal
          itemLabel={showDeleteConfirm.email}
          isDeleting={deleting}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
