"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useMarketplace } from "@/components/marketplace/Marketplacecontext";
import MarketplaceShell from "@/components/marketplace/MarketplaceShell";

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, cartTotal } = useMarketplace();

  if (cart.length === 0) {
    return (
      <MarketplaceShell title="Mon panier">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag size={44} strokeWidth={1.4} className="mb-3 text-calma-ink/30" />
          <h2 className="m-0 mb-1 text-[20px] font-bold text-calma-ink">Ton panier est vide</h2>
          <p className="mb-6 mt-0 text-[15px] text-calma-taupe">
            Découvre nos produits et ajoute-les ici
          </p>
          <Link
            href="/marketplace"
            className="rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline hover:bg-calma-olive"
          >
            Voir la marketplace
          </Link>
        </div>
      </MarketplaceShell>
    );
  }

  return (
    <MarketplaceShell title={`Mon panier (${cart.length})`}>
      <div className="space-y-3">
        {cart.map((item) => (
          <div
            key={`${item.productId}-${item.selectedSize ?? "no-size"}`}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-calma-ink/10 p-4"
          >
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-calma-sand">
              <Image
                src={item.product.image || "/placeholder-product.png"}
                alt={item.product.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>

            <div className="min-w-[140px] flex-1">
              <Link
                href={`/marketplace/${item.productId}`}
                className="text-[15px] font-bold text-calma-ink no-underline hover:underline"
              >
                {item.product.name}
              </Link>
              {item.selectedSize && (
                <p className="m-0 text-[13px] text-calma-taupe">Taille : {item.selectedSize}</p>
              )}
              <p className="m-0 text-[14px] text-calma-taupe">
                {item.product.price.toFixed(2)} TND
              </p>
            </div>

            <div className="flex items-center rounded-full border border-calma-ink/20">
              <button
                type="button"
                onClick={() =>
                  updateCartQuantity(item.productId, item.quantity - 1, item.selectedSize)
                }
                aria-label="Diminuer la quantité"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-calma-sand"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-[15px] font-semibold">{item.quantity}</span>
              <button
                type="button"
                onClick={() =>
                  updateCartQuantity(item.productId, item.quantity + 1, item.selectedSize)
                }
                disabled={item.quantity >= item.product.stock}
                aria-label="Augmenter la quantité"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-calma-sand disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </div>

            <p className="m-0 w-24 text-end text-[16px] font-bold text-calma-ink">
              {(item.product.price * item.quantity).toFixed(2)} TND
            </p>

            <button
              type="button"
              onClick={() => removeFromCart(item.productId, item.selectedSize)}
              aria-label={`Retirer ${item.product.name} du panier`}
              className="grid h-10 w-10 place-items-center rounded-full text-calma-taupe hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-calma-sand p-5 sm:p-6">
        <div className="flex items-center justify-between text-[16px]">
          <span className="text-calma-ink/80">Sous-total</span>
          <span className="text-[20px] font-bold text-calma-ink">{cartTotal.toFixed(2)} TND</span>
        </div>
        <Link
          href="/marketplace/checkout"
          className="mt-4 block rounded-full bg-calma-ink px-6 py-3.5 text-center text-[15px] font-semibold text-white no-underline transition-colors hover:bg-calma-olive"
        >
          Passer la commande
        </Link>
        <Link
          href="/marketplace"
          className="mt-3 block text-center text-[14px] font-semibold text-calma-ink underline underline-offset-4"
        >
          Continuer mes achats
        </Link>
      </div>
    </MarketplaceShell>
  );
}
