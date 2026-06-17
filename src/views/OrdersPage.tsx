'use client';
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Package, Search } from "lucide-react";
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';

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
  pending: "bg-[#FFD700]/10 text-[#856B00]",
  confirmed: "bg-[#87CEEB]/10 text-[#3a7d99]",
  shipped: "bg-blue-500/10 text-blue-600",
  delivered: "bg-[#4CAF50]/10 text-[#4CAF50]",
  cancelled: "bg-red-500/10 text-red-500",
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

  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const lookup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return;
    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/marketplace" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour à la marketplace
        </Link>

        {success && (
          <div className="flex items-center gap-3 bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] rounded-2xl p-4 mb-6">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">
              Commande #{success} confirmée ! Entre ton email ci-dessous pour suivre son statut.
            </p>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes commandes</h1>

        <form onSubmit={lookup} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              required
              placeholder="Ton email pour retrouver tes commandes"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white font-semibold hover:shadow-lg transition-shadow"
          >
            Rechercher
          </button>
        </form>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : searched && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500">Aucune commande trouvée pour cet email</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">Commande #{order.id}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${STATUS_STYLE[order.status] || ""}`}>
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm text-gray-600">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} TND</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="font-bold text-gray-900">{order.total.toFixed(2)} TND</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50/50" />}>
      <OrdersContent />
    </Suspense>
  );
}
