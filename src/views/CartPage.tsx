'use client';

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { useMarketplace } from "@/components/marketplace/Marketplacecontext";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footre";

export default function CartPage() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
  } = useMarketplace();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="w-14 h-14 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Ton panier est vide
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Découvre nos produits et ajoute-les ici
        </p>
        <Link
          href="/marketplace"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white font-semibold"
        >
          Voir la marketplace
        </Link>
      </div>
    );
  }
const { cartCount, wishlist } = useMarketplace();
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-sm text-gray-500 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Continuer mes achats
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


          <h1 className="text-2xl font-bold mb-6">
            Mon panier ({cart.length})
          </h1>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedSize ?? "no-size"}`}
                className="flex items-center gap-4 bg-white p-4 rounded-2xl"
              >
                <div className="relative w-20 h-20">
                  <Image
                    src={item.product.image || "/placeholder-product.png"}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>

                <div className="flex-1">
                  <Link
                    href={`/marketplace/${item.productId}`}
                    className="font-medium text-sm"
                  >
                    {item.product.name}
                  </Link>

                  {item.selectedSize && (
                    <p className="text-xs text-gray-500">
                      Taille: {item.selectedSize}
                    </p>
                  )}

                  <p className="text-sm text-gray-500">
                    {item.product.price.toFixed(2)} TND
                  </p>
                </div>

                {/* qty */}
                <div className="flex items-center border rounded-xl">
                  <button
                    onClick={() =>
                      updateCartQuantity(
                        item.productId,
                        item.quantity - 1,
                        item.selectedSize
                      )
                    }
                    className="w-8 h-8"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="w-8 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateCartQuantity(
                        item.productId,
                        item.quantity + 1,
                        item.selectedSize
                      )
                    }
                    disabled={item.quantity >= item.product.stock}
                    className="w-8 h-8"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <p className="w-20 text-right font-semibold">
                  {(item.product.price * item.quantity).toFixed(2)} TND
                </p>

                <button
                  onClick={() =>
                    removeFromCart(
                      item.productId,
                      item.selectedSize
                    )
                  }
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-6 rounded-2xl">
            <div className="flex justify-between mb-2">
              <span>Sous-total</span>
              <span>{cartTotal.toFixed(2)} TND</span>
            </div>

            <Link
              href="/marketplace/checkout"
              className="block text-center mt-4 py-3 bg-black text-white rounded-xl"
            >
              Passer la commande
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}