import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { Booking, ServiceInfo } from "@/components/dashboard/types";

interface RawBooking {
  id: number | string;
  service: string | null;
  date: string;
  time: string;
  fromLocation: string | null;
  toLocation: string | null;
  status: string;
  price: string | number | null;
  tripType: "one-way" | "round-trip" | null;
  returnDate: string | null;
  returnTime: string | null;
  driver?: string;
  vehicle?: string;
  review: Booking["review"];
}

function mapBooking(b: RawBooking): Booking {
  return {
    id: b.id.toString(),
    service: b.service || "Transfert aéroport",
    date: b.date.split("T")[0],
    time: b.time,
    from: b.fromLocation || "—",
    to: b.toLocation || "—",
    status: b.status.toLowerCase() as Booking["status"],
    price: b.price ? `${b.price} TND` : "À confirmer",
    tripType: b.tripType || "one-way",
    returnDate: b.returnDate ? b.returnDate.split("T")[0] : null,
    returnTime: b.returnTime || null,
    driver: b.driver,
    vehicle: b.vehicle,
    review: b.review ?? null,
  };
}

export function useUserBookings() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceInfo[]>([]);

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch("/api/services");
      if (res.ok) setServices(await res.json());
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(session.user.email)}`);
      if (res.ok) {
        const data: RawBooking[] = await res.json();
        setBookings(data.map(mapBooking));
      }
    } catch (e) {
      console.error(e);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const serviceDetailsFor = (title: string) => services.find((s) => s.title === title) ?? null;

  const handleCancelBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      const data = await res.json();
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
      } else {
        alert(data.error || "Échec de l'annulation.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'annulation.");
    }
  };

  const submitReview = async (bookingId: string, rating: number, comment: string) => {
    const res = await fetch(`/api/bookings/${bookingId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Échec de l'envoi de l'avis.");
      return false;
    }
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              review: { id: data.id, rating: data.rating, comment: data.comment, approved: false },
            }
          : b,
      ),
    );
    return true;
  };

  return {
    session,
    bookings,
    serviceDetailsFor,
    handleCancelBooking,
    submitReview,
  };
}
