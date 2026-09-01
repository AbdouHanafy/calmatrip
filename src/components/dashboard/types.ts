export type PaymentStatus = "pending" | "paid" | "refunded";

export type Booking = {
  id: string;
  service: string;
  date: string;
  time: string;
  from: string;
  to: string;
  status: "confirmed" | "pending" | "cancelled";
  paymentStatus: PaymentStatus;
  price: string;
  passengers: number;
  driver?: string;
  vehicle?: string;
  tripType: "one-way" | "round-trip";
  returnDate?: string | null;
  returnTime?: string | null;
  review?: { id: number; rating: number; comment: string; approved: boolean } | null;
};

export type ServiceInfo = {
  id: number;
  title: string;
  description: string;
  image: string | null;
  category: string | null;
  duration: string | null;
};
