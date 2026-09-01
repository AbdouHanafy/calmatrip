"use client";

import { useEffect, useState } from "react";
import { Check, X, Clock, Package, Compass, MapPin } from "lucide-react";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";

interface OwnedItem {
  id: number;
  submissionStatus: string;
  rejectionReason: string | null;
  createdAt: string;
  owner: { name: string | null; email: string | null } | null;
}

interface ProductItem extends OwnedItem {
  name: string;
  category: string;
  price: number;
}

interface ServiceItem extends OwnedItem {
  title: string;
  category: string | null;
  price: string;
}

interface ExploreListingItem extends OwnedItem {
  title: string;
  category: string;
  price: string | null;
}

type SubmissionItem = ProductItem | ServiceItem | ExploreListingItem;

function itemLabel(item: SubmissionItem) {
  return "name" in item ? item.name : item.title;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-calma-success/10 px-2.5 py-1 text-xs font-semibold text-calma-success">
        <Check size={11} /> Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
        <X size={11} /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-admin-gold/10 px-2.5 py-1 text-xs font-semibold text-[#8A6B2E]">
      <Clock size={11} /> Pending
    </span>
  );
}

type Tab = "products" | "services" | "explore";

const API_SEGMENT: Record<Tab, string> = {
  products: "products",
  services: "services",
  explore: "explore-listings",
};

export default function AdminB2BSubmissions() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [exploreListings, setExploreListings] = useState<ExploreListingItem[]>([]);
  const [tab, setTab] = useState<Tab>("products");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState<SubmissionItem | null>(null);
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/b2b-submissions");
    const data = await res.json();
    setProducts(data.products ?? []);
    setServices(data.services ?? []);
    setExploreListings(data.exploreListings ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (kind: Tab, id: number) => {
    await fetch(`/api/admin/${API_SEGMENT[kind]}/${id}/approve`, { method: "PATCH" });
    load();
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    setRejecting(true);
    await fetch(`/api/admin/${API_SEGMENT[tab]}/${rejectTarget.id}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setRejecting(false);
    setRejectTarget(null);
    setReason("");
    load();
  };

  const items = tab === "products" ? products : tab === "services" ? services : exploreListings;
  const filtered = items.filter((i) => filter === "all" || i.submissionStatus === filter);
  const pendingCount = items.filter((i) => i.submissionStatus === "pending").length;

  const columns: CollectionColumn<SubmissionItem>[] = [
    {
      key: "item",
      label: "Item",
      render: (item) => (
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-calma-ink">{itemLabel(item)}</span>
            {item.category && (
              <span className="rounded-full bg-admin-navy/[.08] px-2 py-0.5 text-xs text-admin-navy">
                {item.category}
              </span>
            )}
          </div>
          {item.submissionStatus === "rejected" && item.rejectionReason && (
            <p className="mt-1 text-xs text-red-600">Reason: {item.rejectionReason}</p>
          )}
        </div>
      ),
    },
    {
      key: "owner",
      label: "Partner",
      render: (item) => (
        <div className="text-xs text-calma-taupe">
          <p>{item.owner?.name ?? "Unknown"}</p>
          <p>{item.owner?.email ?? ""}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) =>
        item.submissionStatus === "pending" ? (
          <div className="flex items-center gap-2">
            <StatusBadge status={item.submissionStatus} />
            <button
              onClick={() => approve(tab, item.id)}
              className="rounded-lg bg-calma-success px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-calma-success/90"
            >
              Approve
            </button>
            <button
              onClick={() => {
                setRejectTarget(item);
                setReason("");
              }}
              className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              Reject
            </button>
          </div>
        ) : (
          <StatusBadge status={item.submissionStatus} />
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">B2B Submissions</h1>
        <p className="mt-1 text-calma-taupe">
          {pendingCount > 0 ? (
            <span className="font-medium text-[#8A6B2E]">{pendingCount} awaiting review</span>
          ) : (
            "Nothing to review right now"
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("products")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === "products"
                ? "bg-admin-navy text-white"
                : "bg-calma-sand text-calma-taupe hover:bg-calma-border"
            }`}
          >
            <Package size={14} /> Products
            <span className="ml-1 text-xs opacity-70">{products.length}</span>
          </button>
          <button
            onClick={() => setTab("services")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === "services"
                ? "bg-admin-navy text-white"
                : "bg-calma-sand text-calma-taupe hover:bg-calma-border"
            }`}
          >
            <Compass size={14} /> Services
            <span className="ml-1 text-xs opacity-70">{services.length}</span>
          </button>
          <button
            onClick={() => setTab("explore")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === "explore"
                ? "bg-admin-navy text-white"
                : "bg-calma-sand text-calma-taupe hover:bg-calma-border"
            }`}
          >
            <MapPin size={14} /> Explore
            <span className="ml-1 text-xs opacity-70">{exploreListings.length}</span>
          </button>
        </div>

        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-admin-gold text-white"
                  : "border border-calma-border bg-white text-calma-taupe hover:border-admin-gold/40"
              }`}
            >
              {f === "all"
                ? "All"
                : f === "pending"
                  ? "Pending"
                  : f === "approved"
                    ? "Approved"
                    : "Rejected"}
            </button>
          ))}
        </div>
      </div>

      <CollectionList
        items={filtered}
        getId={(i) => i.id}
        columns={columns}
        loading={loading}
        emptyIcon={tab === "products" ? Package : tab === "services" ? Compass : MapPin}
        emptyTitle="Nothing in this category"
      />

      {rejectTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setRejectTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-1 text-lg font-bold text-calma-ink">
              Reject &ldquo;{itemLabel(rejectTarget)}&rdquo;?
            </h3>
            <p className="mb-4 text-sm text-calma-taupe">
              Optionally tell the partner why — this reason is shown to them.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Reason (optional)"
              className="mb-4 w-full resize-none rounded-xl border border-calma-border px-3 py-2 text-sm focus:border-admin-gold focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRejectTarget(null)}
                className="flex-1 rounded-xl border border-calma-border px-4 py-2.5 font-medium text-calma-ink transition-colors hover:bg-calma-sand"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={rejecting}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {rejecting ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
