"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Trash2, Clock, MessageCircle } from "lucide-react";

interface CommunityPost {
  id: number;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  image: string | null;
  approved: boolean;
  createdAt: string;
}

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/community?all=true");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: number) => {
    await fetch(`/api/community/${id}/approve`, { method: "PATCH" });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/community/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = posts.filter((p) => {
    if (filter === "pending") return !p.approved;
    if (filter === "approved") return p.approved;
    return true;
  });

  const pending = posts.filter((p) => !p.approved).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-calma-ink">Community management</h1>
          <p className="text-calma-taupe text-sm mt-1">
            {pending > 0 ? (
              <span className="text-amber-600 font-medium">
                {pending} posts awaiting validation
              </span>
            ) : (
              "All posts are processed"
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? "bg-admin-navy text-white"
                : "bg-calma-sand text-calma-taupe hover:bg-calma-border"
            }`}
          >
            {f === "all" ? "All" : f === "pending" ? "Pending" : "Approved"}
            <span className="ml-2 text-xs opacity-70">
              {f === "all"
                ? posts.length
                : f === "pending"
                  ? posts.filter((p) => !p.approved).length
                  : posts.filter((p) => p.approved).length}
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
          <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p>No posts in this category</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <div
              key={post.id}
              className={`bg-white rounded-2xl border p-6 flex gap-4 ${
                !post.approved ? "border-amber-200 bg-amber-50/30" : "border-calma-border"
              }`}
            >
              <div className="flex-shrink-0">
                {post.authorAvatar ? (
                  <Image
                    src={post.authorAvatar}
                    alt={post.authorName}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-admin-navy">
                    <span className="text-white font-bold">{post.authorName.charAt(0)}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-semibold text-calma-ink">{post.authorName}</span>
                  {!post.approved ? (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock size={10} /> Pending
                    </span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Approved
                    </span>
                  )}
                </div>
                <p className="text-calma-taupe text-sm whitespace-pre-wrap line-clamp-4">
                  {post.content}
                </p>
                {post.image && (
                  <div className="relative mt-3 h-40 w-full max-w-xs overflow-hidden rounded-xl bg-calma-sand">
                    <Image src={post.image} alt="" fill className="object-cover" />
                  </div>
                )}
                <p className="text-xs text-calma-taupe mt-2">
                  {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {!post.approved && (
                  <button
                    onClick={() => approve(post.id)}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors"
                  >
                    <Check size={14} /> Approve
                  </button>
                )}
                <button
                  onClick={() => remove(post.id)}
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
