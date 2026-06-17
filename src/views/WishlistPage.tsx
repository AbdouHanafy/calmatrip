'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useMarketplace, Product } from "@/components/marketplace/Marketplacecontext";
import { ProductCard } from "@/components/marketplace/Productcard";
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';

export default function WishlistPage() {
  const { wishlist } = useMarketplace();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(wishlist.map((id) => fetch(`/api/products/${id}`).then((r) => r.json())))
      .then((results) => setProducts(results.map((r) => r.product).filter(Boolean)))
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/marketplace" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Continuer mes achats
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes favoris ({wishlist.length})</h1>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-2xl aspect-[3/4]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucun favori pour le moment</h3>
            <p className="text-sm text-gray-500">Clique sur le cœur d'un produit pour l'ajouter ici</p>
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
