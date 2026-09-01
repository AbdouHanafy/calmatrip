"use client";
import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address: string;
  city?: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-[#D9A441]/10 text-[#8A6B2E] border-[#D9A441]/20",
  confirmed: "bg-[#F2994A]/10 text-[#9C5236] border-[#F2994A]/20",
  shipped: "bg-admin-navy/10 text-admin-navy border-admin-navy/20",
  delivered: "bg-[#5E8B63]/10 text-[#5E8B63] border-[#5E8B63]/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    setLoading(true);
    fetch(`/api/orders?status=${filter}`)
      .then((res) => res.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id: number, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-calma-ink">Commandes</h1>
        <p className="text-sm text-calma-taupe">Suivi et mise à jour des statuts</p>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s
                ? "bg-calma-ink text-white"
                : "bg-calma-sand text-calma-taupe hover:bg-calma-sand"
            }`}
          >
            {s === "all" ? "Toutes" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-calma-sand animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-calma-taupe py-16">Aucune commande</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-calma-border shadow-sm p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-calma-ink">
                    #{order.id} — {order.customerName}
                  </p>
                  <p className="text-xs text-calma-taupe">
                    {order.customerEmail} · {order.customerPhone || "—"}
                  </p>
                  <p className="text-xs text-calma-taupe mt-0.5">
                    {order.address}
                    {order.city ? `, ${order.city}` : ""}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${STATUS_STYLE[order.status] || ""}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 border-t border-calma-border pt-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm text-calma-taupe"
                  >
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} TND</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-calma-border">
                <span className="text-xs text-calma-taupe">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {" · "}
                  {order.paymentMethod === "cod" ? "Paiement à la livraison" : "Carte bancaire"}
                </span>
                <span className="font-bold text-calma-ink">{order.total.toFixed(2)} TND</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
