"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Heart, X } from "lucide-react";
import { motion } from "motion/react";
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
    [router, searchParams],
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

  const allCategories = ["all", ...categories];

  return (
    <div className="sticky top-0 z-20 border-b border-calma-olive/10 bg-calma-cream/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/marketplace"
            className="text-xl font-bold text-calma-ink shrink-0 font-space"
          >
            Marketplace
          </Link>

          {/* Recherche temps réel */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-calma-taupe" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-11 pr-9 py-2.5 rounded-full bg-white border border-calma-olive/15 text-base text-calma-ink outline-none focus:border-calma-terracotta transition-colors sm:text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-calma-taupe hover:text-calma-ink"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
            {/* Actions (wishlist + cart + commandes) */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-1 order-2 sm:order-1">
              <Link
                href="/marketplace/wishlist"
                aria-label="Favoris"
                className="relative flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-full hover:bg-calma-olive/5 flex items-center justify-center transition-colors"
              >
                <Heart className="w-5 h-5 text-calma-ink" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-calma-terracotta text-calma-ink text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                href="/marketplace/cart"
                aria-label="Panier"
                className="relative flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-full hover:bg-calma-olive/5 flex items-center justify-center transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-calma-ink" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-calma-olive text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/marketplace/orders"
                className="flex-1 sm:flex-none w-full sm:w-auto text-center text-sm font-medium text-calma-taupe hover:text-calma-terracotta px-3 py-2 rounded-full transition-colors"
              >
                Mes commandes
              </Link>
            </div>
          </div>
        </div>

        {/* Filtres catégories — sliding pill indicator */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 calma-scrollbar-hide rounded-full">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="relative shrink-0 rounded-full px-4 py-1.5 text-sm font-medium capitalize text-calma-taupe transition-colors data-[active=true]:text-white"
              data-active={activeCategory === cat}
            >
              {activeCategory === cat && (
                <motion.span
                  layoutId="marketplace-cat-pill"
                  className="absolute inset-0 rounded-full bg-calma-olive"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-[1]">{cat === "all" ? "Tout" : cat}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
