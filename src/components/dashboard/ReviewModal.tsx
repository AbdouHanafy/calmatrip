import { useState } from "react";
import { X, Star } from "lucide-react";
import type { Booking } from "./types";

export function ReviewModal({
  booking,
  onClose,
  onSubmit,
}: {
  booking: Booking;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Veuillez sélectionner une note.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Votre commentaire doit contenir au moins 10 caractères.");
      return;
    }
    setError("");
    setSaving(true);
    await onSubmit(rating, comment.trim());
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-calma-ink">Laisser un avis</h3>
            <p className="text-sm text-calma-taupe">{booking.service}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="text-calma-taupe hover:text-calma-ink"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-1">
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
                    : "text-calma-border"
                }
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Comment s'est passée votre expérience ?"
          className="w-full resize-none rounded-xl border border-calma-border bg-calma-sand/40 px-4 py-3 text-sm text-calma-ink outline-none transition-colors focus:border-calma-terracotta focus:bg-white"
        />

        {error && (
          <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="mt-4 w-full rounded-xl bg-calma-terracotta py-3 font-semibold text-white transition-shadow hover:shadow-lg disabled:opacity-60"
        >
          {saving ? "Envoi..." : "Envoyer mon avis"}
        </button>
      </div>
    </div>
  );
}
