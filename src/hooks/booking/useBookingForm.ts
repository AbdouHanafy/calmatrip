import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type {
  DateAvailability,
  LocationValue,
  ServiceOption,
  TimeSlotOption,
} from "@/components/booking/types";
import { toISODate } from "@/components/booking/types";

export function useBookingForm() {
  const { data: session } = useSession();

  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [serviceId, setServiceId] = useState<number | "">("");
  const [availableDates, setAvailableDates] = useState<DateAvailability[]>([]);

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<TimeSlotOption[]>([]);
  const [time, setTime] = useState("");

  const [useManualTime, setUseManualTime] = useState(true);
  const [manualTime, setManualTime] = useState("");

  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");

  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  const [passengers, setPassengers] = useState(1);
  const [hasLuggage, setHasLuggage] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pickupLocation, setPickupLocation] = useState<LocationValue>({
    address: "Tunis-Carthage Airport",
    lat: 36.851,
    lng: 10.227,
  });
  const [destinationLocation, setDestinationLocation] = useState<LocationValue>({
    address: "",
    lat: 0,
    lng: 0,
  });

  // Prefill from session once it loads, without clobbering user edits later
  useEffect(() => {
    if (session?.user?.name) setCustomerName(session.user.name);
    if (session?.user?.email) setCustomerEmail(session.user.email);
  }, [session?.user?.name, session?.user?.email]);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then(setServices)
      .finally(() => setLoadingServices(false));
  }, []);

  useEffect(() => {
    if (!serviceId) return;

    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 30);

    fetch(
      `/api/availability/dates?serviceId=${serviceId}&from=${toISODate(today)}&to=${toISODate(end)}`,
    )
      .then((res) => res.json())
      .then(setAvailableDates);

    setDate("");
    setTime("");
    setManualTime("");
    setSlots([]);
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId || !date) return;

    fetch(`/api/availability?serviceId=${serviceId}&date=${date}`)
      .then((res) => res.json())
      .then(setSlots);

    setTime("");
    setManualTime("");
  }, [serviceId, date]);

  const switchToManual = () => {
    setUseManualTime(true);
    setTime("");
  };

  const handleSubmit = async (e: React.FormEvent, onSuccess: () => void) => {
    e.preventDefault();
    setError(null);

    const finalTime = useManualTime ? manualTime : time;

    if (!serviceId || !date || !finalTime) {
      setError("Please select service, date and time");
      return;
    }
    if (!customerName.trim() || !customerEmail.trim()) {
      setError("Please provide your name and email");
      return;
    }
    if (!passengers || passengers < 1) {
      setError("Please enter at least 1 passenger");
      return;
    }
    if (tripType === "round-trip") {
      if (!returnDate || !returnTime) {
        setError("Please select return date and return time");
        return;
      }
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          tripType,
          date,
          time: finalTime,
          returnDate,
          returnTime,
          fromLocation: pickupLocation.address,
          toLocation: destinationLocation.address,
          passengers,
          hasLuggage,
          customerName,
          customerEmail,
          customerPhone,
          specialRequests,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find((s) => s.id === serviceId);

  return {
    services,
    loadingServices,
    serviceId,
    setServiceId,
    selectedService,
    availableDates,
    date,
    setDate,
    slots,
    time,
    setTime,
    useManualTime,
    manualTime,
    setManualTime,
    switchToManual,
    tripType,
    setTripType,
    returnDate,
    setReturnDate,
    returnTime,
    setReturnTime,
    passengers,
    setPassengers,
    hasLuggage,
    setHasLuggage,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
    customerPhone,
    setCustomerPhone,
    specialRequests,
    setSpecialRequests,
    submitting,
    error,
    pickupLocation,
    setPickupLocation,
    destinationLocation,
    setDestinationLocation,
    handleSubmit,
  };
}
