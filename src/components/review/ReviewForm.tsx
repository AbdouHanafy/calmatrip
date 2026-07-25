"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star, Send } from "lucide-react";

interface ReviewFormProps {
  onSuccess?: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [service, setService] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const services = [
    "Transfert aéroport",
    "Service chauffeur",
    "Excursion",
    "Transport événementiel",
    "Autre",
  ];

  const handleSubmit = async () => {
    if (!session) {
      setError("Connectez-vous pour laisser un avis.");
      return;
    }
    if (rating === 0) {
      setError("Veuillez sélectionner une note.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Votre commentaire doit contenir au moins 10 caractères.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, service }),
      });

      if (!res.ok) throw new Error();

      setSubmitted(true);
      onSuccess?.();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded-calma-block border border-calma-olive/10 bg-calma-cream p-10 text-center font-hanken"
        style={{ boxShadow: "0 22px 50px -22px rgba(42,38,34,.3)" }}
      >
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-fraunces text-2xl font-normal text-calma-olive mb-2">
          Merci pour votre avis !
        </h3>
        <p className="text-calma-taupe">
          Il sera publié après validation par notre équipe.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-calma-block border border-calma-olive/10 bg-calma-cream p-8 sm:p-10 font-hanken"
      style={{ boxShadow: "0 28px 60px -28px rgba(42,38,34,.35)" }}
    >
      {!session && (
        <div className="bg-calma-terracotta/10 border border-calma-terracotta/25 rounded-2xl p-4 mb-6 text-sm text-calma-terracotta">
          Connectez-vous pour laisser un avis.
        </div>
      )}

      <div className="space-y-5">
        {/* Stars */}
        <div className="rounded-2xl border border-calma-olive/15 bg-white px-5 py-4 transition-colors focus-within:border-calma-terracotta">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[.05em] text-calma-taupe">
            Note globale
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={
                    star <= (hovered || rating)
                      ? "fill-calma-gold text-calma-gold"
                      : "text-calma-olive/20"
                  }
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 self-center text-sm text-calma-taupe">
                {["", "Décevant", "Moyen", "Bien", "Très bien", "Excellent"][rating]}
              </span>
            )}
          </div>
        </div>

        {/* Service */}
        <label className="block rounded-2xl border border-calma-olive/15 bg-white px-5 py-3 transition-colors focus-within:border-calma-terracotta">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-[.05em] text-calma-taupe">
            Service utilisé (optionnel)
          </span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full cursor-pointer border-none bg-transparent text-[15px] text-calma-ink outline-none"
          >
            <option value="">Sélectionner un service</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        {/* Comment */}
        <label className="block rounded-2xl border border-calma-olive/15 bg-white px-5 py-3 transition-colors focus-within:border-calma-terracotta">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-[.05em] text-calma-taupe">
            Votre commentaire
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Décrivez votre expérience avec notre service..."
            className="w-full resize-none border-none bg-transparent text-[15px] text-calma-ink outline-none placeholder:text-calma-taupe/60"
          />
        </label>
        <p className="text-xs text-calma-taupe -mt-3">{comment.length} / 500 caractères</p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 rounded-2xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !session}
          className="group flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-semibold text-calma-cream shadow-[0_14px_28px_-10px_rgba(242,153,74,.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-10px_rgba(242,153,74,.75)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{ background: "linear-gradient(135deg,#F2994A 0%,#F2994A 55%,#C97A34 100%)" }}
        >
          {loading ? (
            "Envoi en cours..."
          ) : (
            <>
              Publier mon avis
              <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
