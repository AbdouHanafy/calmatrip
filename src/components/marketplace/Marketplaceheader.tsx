"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Heart, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useMarketplace } from "@/components/marketplace/Marketplacecontext";
import { useCalmaLang } from "@/lib/calma/i18n";

export function MarketplaceHeader({ categories }: { categories: string[] }) {
  const { t } = useCalmaLang();
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
  const iconLink =
    "relative grid h-10 w-10 place-items-center rounded-full border border-calma-ink/20 bg-white text-calma-ink transition-colors hover:border-calma-ink/45";

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-5 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] max-w-[560px] flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-calma-taupe"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.mkt.searchPh}
            className="h-12 w-full rounded-full border border-calma-ink/20 bg-white ps-11 pe-10 text-[15px] text-calma-ink outline-none transition-colors placeholder:text-calma-taupe focus:border-calma-ink"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={t.mkt.clearSearch}
              className="absolute end-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-calma-taupe hover:bg-calma-sand hover:text-calma-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="ms-auto flex items-center gap-2">
          <Link href="/marketplace/wishlist" aria-label={t.mkt.wishlistLabel} className={iconLink}>
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-calma-terracotta px-1 text-[11px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link href="/marketplace/cart" aria-label={t.mkt.cartLabel} className={iconLink}>
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-calma-ink px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/marketplace/orders"
            className="rounded-full border border-calma-ink/20 px-4 py-2.5 text-[14px] font-semibold text-calma-ink no-underline transition-colors hover:border-calma-ink/45"
          >
            {t.mkt.myOrders}
          </Link>
        </div>
      </div>

      <ul className="-mx-4 m-0 mt-4 flex list-none gap-2 overflow-x-auto px-4 pb-1 calma-scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {allCategories.map((cat) => {
          const active = activeCategory === cat;
          return (
            <li key={cat} className="shrink-0">
              <button
                type="button"
                onClick={() => setCategory(cat)}
                aria-pressed={active}
                className={`whitespace-nowrap rounded-full border px-3.5 py-2.5 text-[14px] font-semibold capitalize transition-colors ${
                  active
                    ? "border-calma-ink bg-calma-ink text-white"
                    : "border-calma-ink/15 bg-white text-calma-ink hover:border-calma-ink/45 hover:bg-calma-sand/40"
                }`}
              >
                {cat === "all" ? t.mkt.allLabel : cat}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
