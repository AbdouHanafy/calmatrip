'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, ShoppingCart } from "lucide-react";
import { useMarketplace, Product } from "@/components/marketplace/Marketplacecontext";
import { ProductCard } from "@/components/marketplace/Productcard";
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';

export default function WishlistPage() {
const { cartCount, wishlist } = useMarketplace();
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
