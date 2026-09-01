import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import type { Booking } from "./types";

export function BookingStatusBadge({ status }: { status: Booking["status"] }) {
  const { t } = useCalmaLang();
  const styles = {
    confirmed: "bg-calma-success/10 text-calma-success border-calma-success/20",
    pending: "bg-calma-gold/10 text-[#8A6B2E] border-calma-gold/25",
    cancelled: "bg-red-50 text-red-500 border-red-200",
  };
  const icons = { confirmed: CheckCircle, pending: AlertCircle, cancelled: XCircle };
  const labels = {
    confirmed: t.dash.statusConfirmed,
    pending: t.dash.statusPending,
    cancelled: t.dash.statusCancelled,
  };
  const Icon = icons[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${styles[status]}`}
    >
      <Icon className="w-4 h-4" />
      {labels[status]}
    </span>
  );
}
