"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMarketplace } from "@/components/marketplace/Marketplacecontext";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footre";

const DELIVERY_FEE = 7;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, cartTotal, clearCart } = useMarketplace();

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    paymentMethod: "cod",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill from session once it loads, without clobbering user edits
  useEffect(() => {
    if (session?.user?.name) {
      setForm((f) => (f.customerName ? f : { ...f, customerName: session.user!.name! }));
    }
    if (session?.user?.email) {
      setForm((f) => (f.customerEmail ? f : { ...f, customerEmail: session.user!.email! }));
    }
  }, [session?.user?.name, session?.user?.email]);

  const orderTotal = cartTotal + DELIVERY_FEE;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Ton panier est vide</h1>
        <Link href="/marketplace" className="text-[#87CEEB] underline text-sm">
          Retour à la marketplace
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          total: orderTotal,
          items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de la commande");

      clearCart();
      router.push(`/marketplace/orders?success=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la commande");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/marketplace/cart"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au panier
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Finaliser la commande</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Nom complet
                  </label>
                  <input
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                <input
                  required
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Adresse de livraison
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB] resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Ville</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Mode de paiement
                </label>
                <div className="flex gap-3">
                  {[{ value: "cod", label: "Paiement à la livraison" }].map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setForm({ ...form, paymentMethod: opt.value })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        form.paymentMethod === opt.value
                          ? "border-[#4CAF50] bg-[#4CAF50]/10 text-[#4CAF50]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Note (optionnel)
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#87CEEB] resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white font-semibold disabled:opacity-60 hover:shadow-lg transition-shadow"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirmer la commande
              </button>
            </form>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
              <h3 className="font-semibold text-gray-900 mb-4">Résumé</h3>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 pr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900 shrink-0">
                      {(item.product.price * item.quantity).toFixed(2)} TND
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 mb-4 pt-3 border-t border-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium text-gray-900 shrink-0">
                    {DELIVERY_FEE.toFixed(2)} TND
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">{orderTotal.toFixed(2)} TND</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
