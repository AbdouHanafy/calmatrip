'use client';
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  ChevronRight,
  TrendingUp,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface RecentOrder {
  id: number;
  customerName: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

interface TopProduct {
  name: string;
  sold: number;
  percent: number;
}

interface MarketplaceDashboardData {
  stats: {
    totalProducts: number;
    lowStockProducts: number;
    totalOrders: number;
    pendingOrders: number;
    revenue: number;
  };
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  categoriesCount: Record<string, number>;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-[#FFD700]/10 text-[#856B00] border border-[#FFD700]/20",
  confirmed: "bg-[#87CEEB]/10 text-[#3a7d99] border border-[#87CEEB]/20",
  shipped: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
  delivered: "bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20",
  cancelled: "bg-red-500/10 text-red-500 border border-red-500/20",
};

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />;
}

export function MarketplaceAdminOverview() {
  const [data, setData] = useState<MarketplaceDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetch("/api/admin/marketplace/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json() as Promise<MarketplaceDashboardData>;
      })
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonBlock className="h-80" />
          <SkeletonBlock className="h-80" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-500 font-medium">Échec du chargement du dashboard</p>
        <button onClick={load} className="text-sm text-[#87CEEB] underline hover:text-[#4CAF50]">
          Réessayer
        </button>
      </div>
    );
  }

  const { stats, recentOrders, topProducts } = data;

  const statCards = [
    {
      label: "Produits",
      value: stats.totalProducts.toLocaleString(),
      sub: `${stats.lowStockProducts} en stock bas`,
      icon: Package,
      gradient: "from-[#87CEEB] to-[#4CAF50]",
    },
    {
      label: "Commandes",
      value: stats.totalOrders.toLocaleString(),
      sub: `${stats.pendingOrders} en attente`,
      icon: ShoppingCart,
      gradient: "from-[#FFD700] to-[#FFC107]",
    },
    {
      label: "Stock bas",
      value: stats.lowStockProducts.toLocaleString(),
      sub: "≤ 5 unités",
      icon: AlertTriangle,
      gradient: "from-red-400 to-orange-400",
    },
    {
      label: "Revenu",
      value: `${stats.revenue.toLocaleString()} TND`,
      sub: "commandes validées",
      icon: DollarSign,
      gradient: "from-[#4CAF50] to-[#45A049]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                {stat.sub}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Commandes récentes</h3>
              <p className="text-sm text-gray-500">Dernières activités</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#87CEEB]" />
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Aucune commande encore</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                    <p className="text-xs text-gray-500">
                      #{order.id} · {order.items.length} article{order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-gray-900">{order.total.toFixed(2)} TND</p>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${STATUS_STYLE[order.status] || ""}`}>
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/admin/marketplace/orders"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-[#87CEEB] hover:text-[#4CAF50] transition-colors"
          >
            <span>Voir toutes les commandes</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Produits populaires</h3>
              <p className="text-sm text-gray-500">Meilleures ventes</p>
            </div>
            <Star className="w-5 h-5 text-[#FFD700]" />
          </div>

          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Pas encore de ventes</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{product.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{product.sold} vendus</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] transition-all duration-500"
                      style={{ width: `${product.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-[#87CEEB]/10 to-[#4CAF50]/10 rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Gérer les produits</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Ajouter, modifier ou retirer des produits</p>
          <Link href="/admin/marketplace/products" className="inline-flex items-center gap-2 text-sm font-medium text-[#87CEEB] hover:text-[#4CAF50] transition-colors">
            Gérer <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFC107]/10 rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFC107] flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Commandes</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Suivre et mettre à jour les statuts</p>
          <Link href="/admin/marketplace/orders" className="inline-flex items-center gap-2 text-sm font-medium text-[#FFD700] hover:text-[#FFC107] transition-colors">
            Accéder <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-red-400/10 to-orange-400/10 rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Stock bas</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">{stats.lowStockProducts} produit(s) à réapprovisionner</p>
          <Link href="/admin/marketplace/products?filter=low_stock" className="inline-flex items-center gap-2 text-sm font-medium text-red-500 hover:text-orange-500 transition-colors">
            Vérifier <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}