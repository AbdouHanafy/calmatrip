"use client";

import { useEffect, useState } from "react";
import { Star, Check, Trash2, Clock } from "lucide-react";

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
          className={
            s <= rating ? "fill-amber-400 text-amber-400" : "text-calma-taupe"
          }
        />
      ))}
    </div>
  );
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/reviews?all=true");
    const data = await res.json();
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (id: number) => {
    await fetch(`/api/reviews/${id}/approve`, { method: "PATCH" });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const pending = reviews.filter((r) => !r.approved).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-calma-ink">Reviews management</h1>
          <p className="text-calma-taupe text-sm mt-1">
            {pending > 0 ? (
              <span className="text-amber-600 font-medium">
                {pending} reviews awaiting validation
              </span>
            ) : (
              "All reviews are processed"
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? "bg-calma-olive text-white"
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

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-calma-sand rounded-2xl h-32" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-calma-taupe">
          <Star size={40} className="mx-auto mb-3 opacity-30" />
          <p>No reviews in this category</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-2xl border p-6 flex gap-4 ${
                !review.approved
                  ? "border-amber-200 bg-amber-50/30"
                  : "border-calma-border"
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-calma-olive to-calma-olive-deep flex items-center justify-center">
                    <span className="text-white font-bold">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-semibold text-calma-ink">
                    {review.name}
                  </span>
                  <span className="text-xs text-calma-taupe">{review.email}</span>
                  <StarRating rating={review.rating} />
                  {review.service && (
                    <span className="text-xs bg-calma-olive/10 text-calma-olive px-2 py-0.5 rounded-full">
                      {review.service}
                    </span>
                  )}
                  {!review.approved ? (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock size={10} /> Pending
                    </span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Approved
                    </span>
                  )}
                </div>
                <p className="text-calma-taupe text-sm line-clamp-3">
                  {review.comment}
                </p>
                <p className="text-xs text-calma-taupe mt-2">
                  {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {!review.approved && (
                  <button
                    onClick={() => approve(review.id)}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors"
                  >
                    <Check size={14} /> Approve
                  </button>
                )}
                <button
                  onClick={() => remove(review.id)}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium px-3 py-2 rounded-xl transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}