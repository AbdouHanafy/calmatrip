"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Check, Clock } from "lucide-react";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";

interface Review {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  rating: number;
  comment: string;
  service: string | null;
  approved: boolean;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "fill-admin-gold text-admin-gold" : "text-calma-border"}
        />
      ))}
    </div>
  );
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/reviews?all=true");
    const data = await res.json();
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: number) => {
    await fetch(`/api/reviews/${id}/approve`, { method: "PATCH" });
    load();
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    setDeleting(true);
    await fetch(`/api/reviews/${showDeleteConfirm.id}`, { method: "DELETE" });
    setDeleting(false);
    setShowDeleteConfirm(null);
    load();
  };

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const pending = reviews.filter((r) => !r.approved).length;

  const columns: CollectionColumn<Review>[] = [
    {
      key: "reviewer",
      label: "Reviewer",
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.avatar ? (
            <Image
              src={r.avatar}
              alt={r.name}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-admin-navy to-admin-navy-deep">
              <span className="text-sm font-bold text-white">{r.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <p className="font-semibold text-calma-ink">{r.name}</p>
            <p className="text-xs text-calma-taupe">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (r) => <StarRating rating={r.rating} />,
    },
    {
      key: "service",
      label: "Service",
      render: (r) =>
        r.service ? (
          <span className="rounded-full bg-admin-navy/10 px-2 py-0.5 text-xs text-admin-navy">
            {r.service}
          </span>
        ) : (
          <span className="text-sm text-calma-taupe">—</span>
        ),
    },
    {
      key: "comment",
      label: "Comment",
      render: (r) => (
        <span className="line-clamp-2 max-w-xs text-sm text-calma-taupe">{r.comment}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r) =>
        r.approved ? (
          <span className="flex w-fit items-center gap-1 rounded-full bg-calma-success/10 px-2.5 py-1 text-xs font-semibold text-calma-success">
            <Check size={11} /> Approved
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="flex w-fit items-center gap-1 rounded-full bg-admin-gold/10 px-2.5 py-1 text-xs font-semibold text-admin-gold">
              <Clock size={11} /> Pending
            </span>
            <button
              onClick={() => approve(r.id)}
              className="rounded-lg bg-calma-success px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-calma-success/85"
            >
              Approve
            </button>
          </div>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Reviews</h1>
        <p className="mt-1 text-calma-taupe">
          {pending > 0 ? (
            <span className="font-medium text-admin-gold">
              {pending} reviews awaiting validation
            </span>
          ) : (
            "All reviews are processed"
          )}
        </p>
      </div>

      <div className="flex gap-2">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-admin-navy text-white"
                : "bg-calma-sand text-calma-taupe hover:bg-calma-border"
            }`}
          >
            {f === "all" ? "All" : f === "pending" ? "Pending" : "Approved"}
            <span className="ml-2 text-xs opacity-70">
              {f === "all"
                ? reviews.length
                : f === "pending"
                  ? reviews.filter((r) => !r.approved).length
                  : reviews.filter((r) => r.approved).length}
            </span>
          </button>
        ))}
      </div>

      <CollectionList
        items={filtered}
        getId={(r) => r.id}
        columns={columns}
        loading={loading}
        onDeleteRequest={setShowDeleteConfirm}
        emptyIcon={Star}
        emptyTitle="No reviews in this category"
      />

      {showDeleteConfirm && (
        <DeleteConfirmModal
          itemLabel={`${showDeleteConfirm.name} — ${showDeleteConfirm.rating}★`}
          isDeleting={deleting}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
