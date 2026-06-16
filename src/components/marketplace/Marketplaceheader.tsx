'use client';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Heart, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useMarketplace } from "@/components/marketplace/Marketplacecontext";

export function MarketplaceHeader({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartCount, wishlist } = useMarketplace();

  const [search, setSearch] = useState(searchParams?.get("search") || "");
  const activeCategory = searchParams?.get("category") || "all";

  // Debounced real-time search → updates URL query param
  const updateSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (value) params.set("search", value);
      else params.delete("search");
      router.push(`/marketplace?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== (searchParams?.get("search") || "")) updateSearch(search);
    }, 350);
    return () => clearTimeout(timeout);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (cat === "all") params.delete("category");
    else params.set("category", cat);
    router.push(`/marketplace?${params.toString()}`);
  };

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/marketplace" className="text-xl font-bold text-gray-900 shrink-0">
            Marketplace
          </Link>

          {/* Recherche temps réel */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#87CEEB] focus:border-transparent transition-shadow"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/marketplace/wishlist"
              aria-label="Favoris"
              className="relative w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              href="/marketplace/cart"
              aria-label="Panier"
              className="relative w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#4CAF50] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/marketplace/orders"
              className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-[#87CEEB] px-3 py-2 rounded-xl transition-colors"
            >
              Mes commandes
            </Link>
          </div>
        </div>

        {/* Filtres catégories */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setCategory("all")}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Tout
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                activeCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}