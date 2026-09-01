import { CreditCard } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import type { Booking } from "./types";

export function PaymentsPanel({ bookings }: { bookings: Booking[] }) {
  const { t } = useCalmaLang();

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-calma-border bg-white p-12 text-center">
        <CreditCard className="mx-auto mb-3 h-10 w-10 text-calma-border" />
        <p className="text-calma-taupe">{t.dash.paymentsEmpty}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-calma-border bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-calma-terracotta/10">
          <CreditCard className="h-5 w-5 text-calma-terracotta" />
        </div>
        <div>
          <h2 className="font-fraunces text-lg font-normal text-calma-ink">
            {t.dash.paymentsTitle}
          </h2>
          <p className="text-sm text-calma-taupe">{t.dash.paymentsSub}</p>
        </div>
      </div>

      <div className="space-y-3">
        {bookings.map((b) => (
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
            <div className="flex items-center gap-3">
              <span className="font-fraunces text-base font-semibold text-calma-terracotta">
                {b.price}
              </span>
              <PaymentStatusBadge status={b.paymentStatus} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
