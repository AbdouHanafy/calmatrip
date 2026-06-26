'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Heart, Package, ShoppingCart } from "lucide-react";
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';
import { useMarketplace } from "@/components/marketplace/Marketplacecontext";

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

  const { data: session, status } = useSession();
  const { cartCount, wishlist } = useMarketplace();
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
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

          <Link href="/marketplace" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4" /> Retour à la marketplace
          </Link>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
            {/* Actions (wishlist + cart + commandes) */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 order-2 sm:order-1">
              {/* Wishlist */}
              <Link
                href="/marketplace/wishlist"
                aria-label="Favoris"
                className="relative flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-700" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/marketplace/cart"
                aria-label="Panier"
                className="relative flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#4CAF50] text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Orders */}
              <Link
                href="/marketplace/orders"
                className="flex-1 sm:flex-none w-full sm:w-auto text-center text-sm font-medium text-gray-600 hover:text-[#87CEEB] px-3 py-2 rounded-xl transition-colors"
              >
                Mes commandes
              </Link>
            </div>
          </div>

          {success && (
            <div className="flex items-center gap-3 bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] rounded-2xl p-4 mb-6">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">
                Commande #{success} confirmée !
              </p>
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Mes commandes
          </h1>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500">Aucune commande trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Commande #{order.id}
                      </p>
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
                    <span className="font-bold text-gray-900">
                      {order.total.toFixed(2)} TND
                    </span>
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