'use client';
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Product, useMarketplace } from "@/components/marketplace/Marketplacecontext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useMarketplace();
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  // Add this helper at the top of the component
  const getImageSrc = (image: string | null) => {
    if (!image) return "/placeholder-product.png";
    try {
      const parsed = JSON.parse(image);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {
      // already a plain string URL
    }
    return image;
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/marketplace/${product.id}`} className="block">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={getImageSrc(product.image)}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {outOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-sm font-semibold px-3 py-1 rounded-full bg-red-500/90">
                Rupture de stock
              </span>
            </div>
          )}
          {lowStock && !outOfStock && (
            <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-lg bg-[#FFD700]/90 text-[#856B00]">
              Plus que {product.stock}
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        aria-label={wishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Heart
          className={`w-4 h-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
        />
      </button>

      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.category}</p>
        <Link href={`/marketplace/${product.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1 hover:text-[#87CEEB] transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{product.price.toFixed(2)} TND</span>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={outOfStock}
            aria-label="Ajouter au panier"
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#4CAF50] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
          >
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
