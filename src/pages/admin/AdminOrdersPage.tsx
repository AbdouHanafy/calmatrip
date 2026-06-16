'use client';
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
  pending: "bg-[#FFD700]/10 text-[#856B00] border-[#FFD700]/20",
  confirmed: "bg-[#87CEEB]/10 text-[#3a7d99] border-[#87CEEB]/20",
  shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  delivered: "bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20",
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
        <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
        <p className="text-sm text-gray-500">Suivi et mise à jour des statuts</p>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {s === "all" ? "Toutes" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400 py-16">Aucune commande</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    #{order.id} — {order.customerName}
                  </p>
                  <p className="text-xs text-gray-500">{order.customerEmail} · {order.customerPhone || "—"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.address}{order.city ? `, ${order.city}` : ""}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${STATUS_STYLE[order.status] || ""}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 border-t border-gray-50 pt-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm text-gray-600">
                    <span>{item.productName} × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toFixed(2)} TND</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}
                  {order.paymentMethod === "cod" ? "Paiement à la livraison" : "Carte bancaire"}
                </span>
                <span className="font-bold text-gray-900">{order.total.toFixed(2)} TND</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}