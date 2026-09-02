import { CheckCircle, Ban, type LucideIcon } from "lucide-react";

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredDate: string;
  totalBookings: number;
  status: "active" | "blocked";
  lastBooking?: string;
  totalSpent?: number;
  favoriteService?: string;
};

export type StatCard = {
  label: string;
  value: number;
  icon: LucideIcon;
  change: string;
};

export type DashboardStats = {
  totalClients: number;
  activeClients: number;
  blockedClients: number;
  totalBookings: number;
};

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function getStatusBadge(status: string) {
  if (status === "active") {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: CheckCircle,
      label: "Active",
    };
  }
  return {
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/20",
    icon: Ban,
    label: "Blocked",
  };
}
