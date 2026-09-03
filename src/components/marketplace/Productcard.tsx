"use client";
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
    <div className="group relative bg-calma-cream rounded-calma-card border border-calma-olive/10 shadow-sm hover:shadow-[0_28px_50px_-24px_rgba(21,36,46,.35)] transition-all duration-300 overflow-hidden">
      <Link href={`/marketplace/${product.id}`} className="block">
        <div className="relative aspect-square bg-calma-sand overflow-hidden">
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
            <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-calma-terracotta text-calma-ink">
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
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center transition-transform hover:scale-110"
      >
        <Heart
          className={`w-4 h-4 ${wishlisted ? "fill-calma-terracotta text-calma-terracotta" : "text-calma-taupe"}`}
        />
      </button>

      <div className="p-4">
        <p className="text-xs text-calma-taupe uppercase tracking-wide mb-1">{product.category}</p>
        <Link href={`/marketplace/${product.id}`}>
          <h3 className="font-semibold text-calma-ink text-sm mb-2 line-clamp-1 transition-colors hover:text-calma-terracotta">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-fraunces text-lg font-semibold text-calma-ink">
            {product.price.toFixed(2)} TND
          </span>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={outOfStock}
            aria-label="Ajouter au panier"
            className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{ backgroundColor: "#D2B38B" }}
          >
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
