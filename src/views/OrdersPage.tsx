"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle2, Package } from "lucide-react";
import MarketplaceShell from "@/components/marketplace/MarketplaceShell";

interface OrderItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-blue-500/10 text-blue-600",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-500/10 text-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

function OrdersContent() {
  const searchParams = useSearchParams();
  const success = searchParams?.get("success");

  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (email: string) => {
    setLoading(true);
    const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchOrders(session.user.email);
    }
  }, [session]);

  return (
    <MarketplaceShell title="Mes commandes">
      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          <CheckCircle2 size={20} className="shrink-0" />
          <p className="m-0 text-[14.5px] font-semibold">Commande #{success} confirmée !</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-calma-sand" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package size={44} strokeWidth={1.4} className="mb-3 text-calma-ink/30" />
          <p className="m-0 text-[15px] text-calma-taupe">Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-calma-ink/10 p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="m-0 text-[16px] font-bold text-calma-ink">Commande #{order.id}</p>
                  <p className="m-0 text-[13px] text-calma-taupe">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[12.5px] font-semibold ${STATUS_STYLE[order.status] || ""}`}
                >
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>

              <div className="mb-3 space-y-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-[14.5px] text-calma-ink/80"
                  >
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} TND</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-calma-ink/10 pt-3">
                <span className="text-[14px] text-calma-taupe">Total</span>
                <span className="text-[17px] font-bold text-calma-ink">
                  {order.total.toFixed(2)} TND
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </MarketplaceShell>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OrdersContent />
    </Suspense>
  );
}
