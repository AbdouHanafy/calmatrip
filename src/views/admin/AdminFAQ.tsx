"use client";

import { useEffect, useState } from "react";
import { HelpCircle, ArrowUp, ArrowDown } from "lucide-react";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: string;
  order: number;
}

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<FAQItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/faq");
    const data = await res.json();
    setFaqs(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    setDeleting(true);
    await fetch(`/api/admin/faq/${showDeleteConfirm.id}`, { method: "DELETE" });
    setDeleting(false);
    setShowDeleteConfirm(null);
    load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const a = faqs[index];
    const b = faqs[target];
    await Promise.all([
      fetch(`/api/admin/faq/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: b.order }),
      }),
      fetch(`/api/admin/faq/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: a.order }),
      }),
    ]);
    load();
  };

  const columns: CollectionColumn<FAQItem>[] = [
    {
      key: "order",
      label: "Order",
      render: (faq) => {
        const index = faqs.findIndex((f) => f.id === faq.id);
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
              disabled={index === faqs.length - 1}
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
      key: "question",
      label: "Question",
      render: (faq) => <span className="font-semibold text-calma-ink">{faq.question}</span>,
    },
    {
      key: "answer",
      label: "Answer",
      render: (faq) => (
        <span className="line-clamp-2 max-w-md text-sm text-calma-taupe">{faq.answer}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">FAQ</h1>
        <p className="mt-1 text-calma-taupe">
          {faqs.length} question{faqs.length !== 1 ? "s" : ""} published on the site
        </p>
      </div>

      <CollectionList
        items={faqs}
        getId={(f) => f.id}
        columns={columns}
        loading={loading}
        getRowHref={(f) => `/admin/faq/${f.id}`}
        createHref="/admin/faq/new"
        createLabel="New question"
        onDeleteRequest={setShowDeleteConfirm}
        emptyIcon={HelpCircle}
        emptyTitle="No questions yet"
      />

      {showDeleteConfirm && (
        <DeleteConfirmModal
          itemLabel={showDeleteConfirm.question}
          isDeleting={deleting}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
