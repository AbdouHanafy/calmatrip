import { CreditCard, CheckCircle2, RotateCcw } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import type { PaymentStatus } from "./types";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { t } = useCalmaLang();
  const styles: Record<PaymentStatus, string> = {
    paid: "bg-calma-success/10 text-calma-success border-calma-success/20",
    pending: "bg-calma-gold/10 text-[#8A6B2E] border-calma-gold/25",
    refunded: "bg-calma-taupe/10 text-calma-taupe border-calma-taupe/25",
  };
  const icons = { paid: CheckCircle2, pending: CreditCard, refunded: RotateCcw };
  const labels: Record<PaymentStatus, string> = {
    paid: t.dash.paymentPaid,
    pending: t.dash.paymentPending,
    refunded: t.dash.paymentRefunded,
  };
  const Icon = icons[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${styles[status]}`}
    >
      <Icon className="h-4 w-4" />
      {labels[status]}
    </span>
  );
}
