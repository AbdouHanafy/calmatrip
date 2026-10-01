"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Product, useMarketplace } from "@/components/marketplace/Marketplacecontext";
import { CALMA_DICT, useOptionalCalmaLang } from "@/lib/calma/i18n";

export function ProductCard({ product }: { product: Product }) {
  // ProductCard is also rendered from pages without a CalmaLangProvider (ProductDetailPage,
  // WishlistPage) — fall back to French rather than crash.
  const t = useOptionalCalmaLang()?.t ?? CALMA_DICT.fr;
  const { addToCart, toggleWishlist, isWishlisted } = useMarketplace();
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

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
    <div className="group relative">
      <Link href={`/marketplace/${product.id}`} className="block no-underline">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-calma-sand">
          <Image
            src={getImageSrc(product.image)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 50vw"
          />
          {outOfStock && (
            <div className="absolute inset-0 grid place-items-center bg-black/45">
              <span className="rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-calma-ink">
                {t.mkt.outOfStock}
              </span>
            </div>
          )}
          {lowStock && !outOfStock && (
            <span className="absolute start-2.5 top-2.5 rounded-md bg-white px-2 py-1 text-[11px] font-bold text-calma-ink shadow-sm">
              {t.mkt.lowStock.replace("{n}", String(product.stock))}
            </span>
          )}
        </div>

        <div className="pt-3">
          <div className="mb-1 text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
            {product.category}
          </div>
          <h3 className="m-0 line-clamp-2 text-[16px] font-bold leading-snug text-calma-ink group-hover:underline">
            {product.name}
          </h3>
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.id);
        }}
        aria-label={wishlisted ? t.mkt.removeFromWishlist : t.mkt.addToWishlist}
        className="absolute end-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm transition-transform hover:scale-105"
      >
        <Heart
          size={17}
          className={wishlisted ? "fill-calma-terracotta text-calma-terracotta" : "text-calma-ink"}
        />
      </button>

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-[16px] font-bold text-calma-ink">{product.price.toFixed(2)} TND</span>
        <button
          type="button"
          onClick={() => addToCart(product, 1)}
          disabled={outOfStock}
          aria-label={t.mkt.addToCart}
          className="grid h-9 w-9 place-items-center rounded-full border border-calma-ink/25 text-calma-ink transition-colors hover:border-calma-ink hover:bg-calma-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-calma-ink"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
    </div>
  );
}
