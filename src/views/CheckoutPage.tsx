"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useMarketplace } from "@/components/marketplace/Marketplacecontext";
import MarketplaceShell from "@/components/marketplace/MarketplaceShell";

const DELIVERY_FEE = 7;

const inputClass =
  "w-full rounded-xl border border-calma-ink/20 bg-white px-4 py-3 text-[15px] text-calma-ink outline-none transition-colors placeholder:text-calma-taupe/70 focus:border-calma-ink";
const labelClass = "mb-1.5 block text-[13.5px] font-semibold text-calma-ink";

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
  const sessionName = session?.user?.name;
  const sessionEmail = session?.user?.email;

  // Prefill from session once it loads, without clobbering user edits
  useEffect(() => {
    if (sessionName) {
      setForm((f) => (f.customerName ? f : { ...f, customerName: sessionName }));
    }
    if (sessionEmail) {
      setForm((f) => (f.customerEmail ? f : { ...f, customerEmail: sessionEmail }));
    }
  }, [sessionName, sessionEmail]);

  const orderTotal = cartTotal + DELIVERY_FEE;

  if (cart.length === 0) {
    return (
      <MarketplaceShell title="Finaliser la commande">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="m-0 mb-4 text-[20px] font-bold text-calma-ink">Ton panier est vide</h2>
          <Link
            href="/marketplace"
            className="rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline hover:bg-calma-olive"
          >
            Retour à la marketplace
          </Link>
        </div>
      </MarketplaceShell>
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
    <MarketplaceShell title="Finaliser la commande">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-calma-ink/10 bg-white p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nom complet</label>
              <input
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Téléphone</label>
              <input
                type="tel"
                inputMode="tel"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              required
              type="email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Adresse de livraison</label>
            <textarea
              required
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Ville</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Mode de paiement</label>
            <div className="flex gap-3">
              {[{ value: "cod", label: "Paiement à la livraison" }].map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setForm({ ...form, paymentMethod: opt.value })}
                  aria-pressed={form.paymentMethod === opt.value}
                  className={`flex-1 rounded-full border py-2.5 text-[14px] font-semibold transition-colors ${
                    form.paymentMethod === opt.value
                      ? "border-calma-ink bg-calma-ink text-white"
                      : "border-calma-ink/20 text-calma-ink hover:border-calma-ink/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Note (optionnel)</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && <p className="m-0 text-[14px] text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-calma-ink px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-calma-olive disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Confirmer la commande
          </button>
        </form>

        <div className="h-fit rounded-2xl bg-calma-sand p-5 sm:p-6">
          <h3 className="m-0 mb-4 text-[17px] font-bold text-calma-ink">Résumé</h3>
          <div className="mb-4 space-y-2.5">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedSize ?? ""}`}
                className="flex items-center justify-between gap-2 text-[14px]"
              >
                <span className="line-clamp-1 text-calma-ink/80">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-semibold text-calma-ink">
                  {(item.product.price * item.quantity).toFixed(2)} TND
                </span>
              </div>
            ))}
          </div>
          <div className="mb-4 flex items-center justify-between border-t border-calma-ink/10 pt-3 text-[14px]">
            <span className="text-calma-ink/80">Livraison</span>
            <span className="font-semibold text-calma-ink">{DELIVERY_FEE.toFixed(2)} TND</span>
          </div>
          <div className="flex items-center justify-between border-t border-calma-ink/10 pt-4">
            <span className="text-[15px] font-bold text-calma-ink">Total</span>
            <span className="text-[19px] font-bold text-calma-ink">
              {orderTotal.toFixed(2)} TND
            </span>
          </div>
        </div>
      </div>
    </MarketplaceShell>
  );
}
