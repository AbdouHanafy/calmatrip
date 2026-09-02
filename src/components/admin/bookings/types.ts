import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "refunded";

export interface Booking {
  id: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  service: string;
  date: string;
  time: string;

  tripType?: "one-way" | "round-trip";
  returnDate?: string | null;
  returnTime?: string | null;

  fromLocation: string;
  toLocation: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  price: string | null;
  passengers: number;
  specialRequests: string | null;
  driver: string | null;
  vehicle: string | null;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Stats {
  total: number;
  confirmed: number;
  pending: number;
  revenue: number;
}

export const STATUS_CONFIG: Record<
  BookingStatus,
  { bg: string; text: string; border: string; icon: typeof CheckCircle; label: string }
> = {
  confirmed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle,
    label: "Confirmed",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: AlertCircle,
    label: "Pending",
  },
  cancelled: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/20",
    icon: XCircle,
    label: "Cancelled",
  },
  completed: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: CheckCircle,
    label: "Completed",
  },
};

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { bg: string; text: string; border: string; icon: typeof CheckCircle; label: string }
> = {
  paid: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle,
    label: "Paid",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: AlertCircle,
    label: "Payment pending",
  },
  refunded: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
    icon: XCircle,
    label: "Refunded",
  },
};

export function whatsappLink(phone: string | null, name: string | null) {
  return `https://wa.me/${(phone ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(
    `Bonjour ${name}, concernant votre réservation...`,
  )}`;
}
