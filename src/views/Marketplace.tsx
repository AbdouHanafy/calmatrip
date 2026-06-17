'use client';
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { MarketplaceHeader } from "@/components/marketplace/Marketplaceheader";
import { ProductCard } from "@/components/marketplace/Productcard";
import { Product } from "@/components/marketplace/Marketplacecontext";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footre";

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const search = searchParams?.get("search") || "";
  const category = searchParams?.get("category") || "all";
  const sort = searchParams?.get("sort") || "newest";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (sort) params.set("sort", sort);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setCategories(data.categories || []);
      })
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50/50">
      <MarketplaceHeader categories={categories} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {loading ? "Chargement..." : `${products.length} produit${products.length !== 1 ? "s" : ""}`}
          </p>
          <select
            value={sort}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams?.toString());
              params.set("sort", e.target.value);
              window.location.href = `/marketplace?${params.toString()}`;
            }}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
          >
            <option value="newest">Plus récents</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="name">Nom A-Z</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-2xl aspect-[3/4]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PackageSearch className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucun produit trouvé</h3>
            <p className="text-sm text-gray-500">Essaie une autre recherche ou catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50/50" />}>
      <MarketplaceContent />
    </Suspense>
  );
}
