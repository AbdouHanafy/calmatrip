'use client';
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useMarketplace } from "@/components/marketplace/Marketplacecontext";
import { Navbar } from '@/components/layouts/Navbar';
import { Footer } from '@/components/layouts/Footre';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, cartTotal } = useMarketplace();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="w-14 h-14 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Ton panier est vide</h1>
        <p className="text-sm text-gray-500 mb-6">Découvre nos produits et ajoute-les ici</p>
        <Link
          href="/marketplace"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white font-semibold hover:shadow-lg transition-shadow"
        >
          Voir la marketplace
        </Link>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/marketplace" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" /> Continuer mes achats
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon panier ({cart.length})</h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="relative w-20 h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                <Image
                  src={item.product.image || "/placeholder-product.png"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/marketplace/${item.productId}`} className="font-medium text-gray-900 text-sm hover:text-[#87CEEB] line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{item.product.price.toFixed(2)} TND</p>
              </div>

              <div className="flex items-center border border-gray-200 rounded-xl shrink-0">
                <button
                  onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-xl"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-xl disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="font-semibold text-gray-900 w-20 text-right shrink-0">
                {(item.product.price * item.quantity).toFixed(2)} TND
              </p>

              <button
                onClick={() => removeFromCart(item.productId)}
                aria-label="Retirer"
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-semibold text-gray-900">{cartTotal.toFixed(2)} TND</span>
          </div>
          <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
            <span>Livraison</span>
            <span>Calculée au checkout</span>
          </div>
          <Link
            href="/marketplace/checkout"
            className="block text-center w-full py-3 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white font-semibold hover:shadow-lg transition-shadow"
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