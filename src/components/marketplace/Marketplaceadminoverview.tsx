"use client";
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
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "border border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border border-blue-200 bg-blue-50 text-blue-700",
  shipped: "border border-indigo-200 bg-indigo-50 text-indigo-700",
  delivered: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border border-red-200 bg-red-50 text-red-700",
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
        <p className="text-red-500 font-medium">Failed to load dashboard</p>
        <button
          onClick={load}
          className="text-sm text-admin-gold-deep underline hover:text-admin-navy"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, recentOrders, topProducts } = data;

  const statCards = [
    {
      label: "Products",
      value: stats.totalProducts.toLocaleString(),
      sub: `${stats.lowStockProducts} low stock`,
      icon: Package,
    },
    {
      label: "Orders",
      value: stats.totalOrders.toLocaleString(),
      sub: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
    },
    {
      label: "Low Stock",
      value: stats.lowStockProducts.toLocaleString(),
      sub: "≤ 5 units",
      icon: AlertTriangle,
    },
    {
      label: "Revenue",
      value: `${stats.revenue.toLocaleString()} TND`,
      sub: "confirmed orders",
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100">
                <stat.icon className="h-6 w-6 text-admin-navy" />
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-500">Latest activities</p>
            </div>
            <TrendingUp className="h-5 w-5 text-admin-gold" />
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                    <p className="text-xs text-gray-500">
                      #{order.id} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {order.total.toFixed(2)} TND
                    </p>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${STATUS_STYLE[order.status] || ""}`}
                    >
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/admin/marketplace/orders"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-admin-gold-deep transition-colors hover:text-admin-navy"
          >
            <span>View all orders</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Popular Products</h3>
              <p className="text-sm text-gray-500">Best sellers</p>
            </div>
            <Star className="h-5 w-5 text-admin-gold" />
          </div>

          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No sales yet</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{product.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{product.sold} sold</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-admin-gold transition-all duration-500"
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-admin-navy">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Manage Products</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Add, edit or remove products</p>
          <Link
            href="/admin/marketplace/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-admin-gold-deep transition-colors hover:text-admin-navy"
          >
            Manage <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-admin-navy">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Orders</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Track and update statuses</p>
          <Link
            href="/admin/marketplace/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-admin-gold-deep transition-colors hover:text-admin-navy"
          >
            Access <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100">
              <AlertTriangle className="h-5 w-5 text-admin-navy" />
            </div>
            <h3 className="font-semibold text-gray-900">Low Stock</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {stats.lowStockProducts} product(s) to restock
          </p>
          <Link
            href="/admin/marketplace/products?filter=low_stock"
            className="inline-flex items-center gap-2 text-sm font-medium text-admin-gold-deep transition-colors hover:text-admin-navy"
          >
            Check <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
