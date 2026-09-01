import { Star } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import type { Booking } from "./types";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${s <= rating ? "fill-calma-gold text-calma-gold" : "text-calma-border"}`}
        />
      ))}
    </div>
  );
}

export function ReviewsPanel({
  eligible,
  reviewed,
  onReview,
}: {
  eligible: Booking[];
  reviewed: Booking[];
  onReview: (booking: Booking) => void;
}) {
  const { t } = useCalmaLang();

  if (eligible.length === 0 && reviewed.length === 0) {
    return (
      <div className="rounded-2xl border border-calma-border bg-white p-12 text-center">
        <Star className="mx-auto mb-3 h-10 w-10 text-calma-border" />
        <p className="text-calma-taupe">{t.dash.reviewsEmpty}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-calma-border bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-calma-terracotta/10">
          <Star className="h-5 w-5 text-calma-terracotta" />
        </div>
        <div>
          <h2 className="font-fraunces text-lg font-normal text-calma-ink">
            {t.dash.reviewsTitle}
          </h2>
          <p className="text-sm text-calma-taupe">{t.dash.reviewsSub}</p>
        </div>
      </div>

      <div className="space-y-8">
        {eligible.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-calma-ink">
              {t.dash.reviewsToRateTitle}
            </h3>
            <div className="space-y-3">
              {eligible.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-3 rounded-xl border border-calma-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-calma-ink">{b.service}</p>
                    <p className="text-xs text-calma-taupe">
                      {new Date(b.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => onReview(b)}
                    className="rounded-xl bg-calma-terracotta px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-calma-terracotta-deep"
                  >
                    {t.dash.leaveReviewBtn}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {reviewed.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-calma-ink">
              {t.dash.reviewsYoursTitle}
            </h3>
            <div className="space-y-3">
              {reviewed.map((b) => (
                <div key={b.id} className="rounded-xl border border-calma-border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-calma-ink">{b.service}</p>
                    <StarRow rating={b.review!.rating} />
                  </div>
                  <p className="text-sm text-calma-taupe">{b.review!.comment}</p>
                  {!b.review!.approved && (
                    <p className="mt-2 text-xs font-medium text-calma-gold">
                      {t.dash.reviewsPendingApproval}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
