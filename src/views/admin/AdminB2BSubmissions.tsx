"use client";

import { useEffect, useState } from "react";
import { Check, X, Clock, Package, Compass } from "lucide-react";

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

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-calma-success/10 px-2.5 py-1 text-xs font-semibold text-calma-success">
        <Check size={11} /> Approuvé
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
        <X size={11} /> Refusé
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-calma-gold/10 px-2.5 py-1 text-xs font-semibold text-[#8A6B2E]">
      <Clock size={11} /> En attente
    </span>
  );
}

export default function AdminB2BSubmissions() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [tab, setTab] = useState<"products" | "services">("products");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/b2b-submissions");
    const data = await res.json();
    setProducts(data.products ?? []);
    setServices(data.services ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (kind: "products" | "services", id: number) => {
    await fetch(`/api/admin/${kind}/${id}/approve`, { method: "PATCH" });
    load();
  };

  const reject = async (kind: "products" | "services", id: number) => {
    const reason = window.prompt("Raison du refus (optionnel) :") ?? "";
    await fetch(`/api/admin/${kind}/${id}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    load();
  };

  const items = tab === "products" ? products : services;
  const filtered = items.filter((i) => filter === "all" || i.submissionStatus === filter);
  const pendingCount = items.filter((i) => i.submissionStatus === "pending").length;

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Soumissions B2B</h1>
        <p className="mt-1 text-sm text-calma-taupe">
          {pendingCount > 0 ? (
            <span className="font-medium text-[#8A6B2E]">{pendingCount} en attente de validation</span>
          ) : (
            "Rien à valider pour le moment"
          )}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("products")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === "products" ? "bg-calma-olive text-white" : "bg-calma-sand text-calma-taupe hover:bg-calma-border"
            }`}
          >
            <Package size={14} /> Produits
            <span className="ml-1 text-xs opacity-70">{products.length}</span>
          </button>
          <button
            onClick={() => setTab("services")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === "services" ? "bg-calma-olive text-white" : "bg-calma-sand text-calma-taupe hover:bg-calma-border"
            }`}
          >
            <Compass size={14} /> Services
            <span className="ml-1 text-xs opacity-70">{services.length}</span>
          </button>
        </div>

        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f ? "bg-calma-terracotta text-white" : "bg-white text-calma-taupe border border-calma-border hover:border-calma-terracotta/40"
              }`}
            >
              {f === "all" ? "Tous" : f === "pending" ? "En attente" : f === "approved" ? "Approuvés" : "Refusés"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-calma-sand" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-calma-taupe">
          {tab === "products" ? <Package size={40} className="mx-auto mb-3 opacity-30" /> : <Compass size={40} className="mx-auto mb-3 opacity-30" />}
          <p>Rien dans cette catégorie</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 sm:flex-row sm:items-center sm:justify-between ${
                item.submissionStatus === "pending" ? "border-calma-gold/30 bg-calma-gold/[.03]" : "border-calma-border"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                  <span className="font-semibold text-calma-ink">
                    {"name" in item ? item.name : item.title}
                  </span>
                  <StatusBadge status={item.submissionStatus} />
                  {item.category && (
                    <span className="rounded-full bg-calma-olive/[.08] px-2.5 py-1 text-xs text-calma-olive">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-calma-taupe">
                  {item.owner?.name ?? "Inconnu"} · {item.owner?.email ?? ""}
                </p>
                {item.submissionStatus === "rejected" && item.rejectionReason && (
                  <p className="mt-1.5 text-xs text-red-600">Raison : {item.rejectionReason}</p>
                )}
              </div>

              {item.submissionStatus === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(tab, item.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-calma-success px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-calma-success/90"
                  >
                    <Check size={14} /> Approuver
                  </button>
                  <button
                    onClick={() => reject(tab, item.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                  >
                    <X size={14} /> Refuser
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
