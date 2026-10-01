"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Star, Send, CheckCircle } from "lucide-react";

interface ReviewFormProps {
  onSuccess?: () => void;
}

const field =
  "block rounded-xl border border-calma-ink/20 bg-white px-4 py-3 transition-colors focus-within:border-calma-ink";
const fieldLabel = "mb-1 block text-[12px] font-semibold text-calma-taupe";

// Rendered inside the card of the homepage's "share your experience" block, so it draws
// no card of its own.
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
      <div className="rounded-xl bg-calma-sand p-8 text-center font-hanken">
        <CheckCircle size={40} className="mx-auto mb-3 text-calma-success" />
        <h3 className="m-0 mb-1 text-[18px] font-bold text-calma-ink">Merci pour votre avis !</h3>
        <p className="m-0 text-[14.5px] text-calma-taupe">
          Il sera publié après validation par notre équipe.
        </p>
      </div>
    );
  }

  return (
    <div className="font-hanken">
      {!session && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-calma-sand px-4 py-3 text-[14px] text-calma-ink">
          <span>Connectez-vous pour laisser un avis.</span>
          <Link
            href="/login?callbackUrl=/"
            className="rounded-full bg-calma-ink px-4 py-1.5 text-[13px] font-semibold text-white no-underline hover:bg-calma-olive"
          >
            Connexion
          </Link>
        </div>
      )}

      <div className="space-y-4">
        <div className={field}>
          <span className={fieldLabel}>Note globale</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} / 5`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={26}
                  className={
                    star <= (hovered || rating)
                      ? "fill-calma-gold text-calma-gold"
                      : "text-calma-ink/20"
                  }
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ms-2 text-[14px] text-calma-taupe">
                {["", "Décevant", "Moyen", "Bien", "Très bien", "Excellent"][rating]}
              </span>
            )}
          </div>
        </div>

        <label className={field}>
          <span className={fieldLabel}>Service utilisé (optionnel)</span>
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

        <label className={field}>
          <span className={fieldLabel}>Votre commentaire</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Décrivez votre expérience avec notre service..."
            className="w-full resize-none border-none bg-transparent text-[15px] text-calma-ink outline-none placeholder:text-calma-taupe/60"
          />
        </label>
        <p className="-mt-2 mb-0 text-[12.5px] text-calma-taupe">
          {comment.length} / 500 caractères
        </p>

        {error && (
          <p className="m-0 rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-600">{error}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !session}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-calma-ink px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-calma-olive disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            "Envoi en cours..."
          ) : (
            <>
              Publier mon avis
              <Send size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
