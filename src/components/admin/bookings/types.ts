import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";

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
    bg: "bg-[#5E8B63]/10",
    text: "text-[#5E8B63]",
    border: "border-[#5E8B63]/20",
    icon: CheckCircle,
    label: "Confirmed",
  },
  pending: {
    bg: "bg-[#D9A441]/10",
    text: "text-[#8A6B2E]",
    border: "border-[#D9A441]/20",
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
    bg: "bg-[#F2994A]/10",
    text: "text-[#C97A34]",
    border: "border-[#F2994A]/20",
    icon: CheckCircle,
    label: "Completed",
  },
};

export function whatsappLink(phone: string | null, name: string | null) {
  return `https://wa.me/${(phone ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(
    `Bonjour ${name}, concernant votre réservation...`,
  )}`;
}
