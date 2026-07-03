'use client';
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { MarketplaceHeader } from "@/components/marketplace/Marketplaceheader";
import { ProductCard } from "@/components/marketplace/Productcard";
import { Product } from "@/components/marketplace/Marketplacecontext";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footre";
import { Clock3, ShoppingBag, Sparkles } from "lucide-react";


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
    // <>
    // <Navbar />
    // <div className="min-h-screen bg-gray-50/50">
    //   <MarketplaceHeader categories={categories} />

    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    //     <div className="flex items-center justify-between mb-6">
    //       <p className="text-sm text-gray-500">
    //         {loading ? "Chargement..." : `${products.length} produit${products.length !== 1 ? "s" : ""}`}
    //       </p>
    //       <select
    //         value={sort}
    //         onChange={(e) => {
    //           const params = new URLSearchParams(searchParams?.toString());
    //           params.set("sort", e.target.value);
    //           window.location.href = `/marketplace?${params.toString()}`;
    //         }}
    //         className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
    //       >
    //         <option value="newest">Plus récents</option>
    //         <option value="price_asc">Prix croissant</option>
    //         <option value="price_desc">Prix décroissant</option>
    //         <option value="name">Nom A-Z</option>
    //       </select>
    //     </div>

    //     {loading ? (
    //       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    //         {Array.from({ length: 8 }).map((_, i) => (
    //           <div key={i} className="bg-gray-100 animate-pulse rounded-2xl aspect-[3/4]" />
    //         ))}
    //       </div>
    //     ) : products.length === 0 ? (
    //       <div className="flex flex-col items-center justify-center py-24 text-center">
    //         <PackageSearch className="w-12 h-12 text-gray-300 mb-4" />
    //         <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucun produit trouvé</h3>
    //         <p className="text-sm text-gray-500">Essaie une autre recherche ou catégorie</p>
    //       </div>
    //     ) : (
    //       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    //         {products.map((product) => (
    //           <ProductCard key={product.id} product={product} />
    //         ))}
    //       </div>
    //     )}
    //   </div>
    // </div>
    // <Footer />
    // </>
    <>
      <Navbar />

      <main className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center px-6">

        {/* Background Blurs */}
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="relative z-10 max-w-2xl text-center">

          {/* Icon */}
          <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 shadow-2xl shadow-sky-200">
            <ShoppingBag className="h-14 w-14 text-white" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-5 py-2 text-sm font-medium text-sky-600 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Something exciting is coming
          </div>

          {/* Title */}
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-gray-900">
            Marketplace
            <span className="block bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We're preparing an amazing marketplace where you'll be able to
            discover premium travel products, accessories, souvenirs, and much
            more.
          </p>

          {/* Features */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
              <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-sky-500" />
              <h3 className="font-semibold text-gray-900">
                Premium Products
              </h3>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
              <Clock3 className="mx-auto mb-3 h-8 w-8 text-sky-500" />
              <h3 className="font-semibold text-gray-900">
                Fast Delivery
              </h3>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-sky-500" />
              <h3 className="font-semibold text-gray-900">
                Exclusive Offers
              </h3>
            </div>

          </div>

          {/* Bottom */}
          <div className="mt-14 inline-flex items-center gap-3 rounded-full bg-sky-500 px-8 py-4 text-white shadow-lg shadow-sky-200">
            🚀 Launching Soon
          </div>

        </div>
      </main>

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
