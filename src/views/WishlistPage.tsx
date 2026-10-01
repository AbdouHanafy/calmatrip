"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useMarketplace, Product } from "@/components/marketplace/Marketplacecontext";
import { ProductCard } from "@/components/marketplace/Productcard";
import MarketplaceShell from "@/components/marketplace/MarketplaceShell";

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
    <MarketplaceShell title={`Mes favoris (${wishlist.length})`} width="wide">
      {loading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-calma-sand" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart size={44} strokeWidth={1.4} className="mb-3 text-calma-ink/30" />
          <h2 className="m-0 mb-1 text-[20px] font-bold text-calma-ink">
            Aucun favori pour le moment
          </h2>
          <p className="mb-6 mt-0 text-[15px] text-calma-taupe">
            Clique sur le cœur d&apos;un produit pour l&apos;ajouter ici
          </p>
          <Link
            href="/marketplace"
            className="rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline hover:bg-calma-olive"
          >
            Voir la marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </MarketplaceShell>
  );
}
