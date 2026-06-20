'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Car, Clock, Luggage, MapPin, Users, Calendar, 
  ChevronRight, Sparkles, User, Mail, AlertCircle 
} from "lucide-react";
import { useSession } from "next-auth/react";

interface ServiceOption {
  id: number;
  title: string;
  subtitle: string | null;
  price: string;
  icon: string;
  duration: string | null;
  category: string | null;
}

interface DateAvailability {
  date: string;
  available: boolean;
  remaining: number;
}

interface TimeSlotOption {
  id: number;
  time: string;
  capacity: number;
  booked: number;
  remaining: number;
  full: boolean;
}

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function BookingForm() {
  const router = useRouter();
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

  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [hasLuggage, setHasLuggage] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill from session once it loads, without clobbering user edits later
  useEffect(() => {
    if (session?.user?.name) setCustomerName(session.user.name);
    if (session?.user?.email) setCustomerEmail(session.user.email);
  }, [session?.user?.name, session?.user?.email]);

  useEffect(() => {
    fetch("/api/services")
      .then(res => res.json())
      .then(setServices)
      .finally(() => setLoadingServices(false));
  }, []);

  useEffect(() => {
    if (!serviceId) return;

    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 30);

    fetch(`/api/availability/dates?serviceId=${serviceId}&from=${toISODate(today)}&to=${toISODate(end)}`)
      .then(res => res.json())
      .then(setAvailableDates);

    setDate("");
    setTime("");
    setManualTime("");
    setSlots([]);
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId || !date) return;

    fetch(`/api/availability?serviceId=${serviceId}&date=${date}`)
      .then(res => res.json())
      .then(setSlots);

    setTime("");
    setManualTime("");
  }, [serviceId, date]);

  const switchToSlots = () => {
    setUseManualTime(false);
    setManualTime("");
  };

  const switchToManual = () => {
    setUseManualTime(true);
    setTime("");
  };

  const handlePassengersChange = (raw: string) => {
    if (raw === "") {
      setPassengers(1); // don't let the field collapse to NaN
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    setPassengers(Math.min(8, Math.max(1, n)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          date,
          time: finalTime,
          fromLocation,
          toLocation,
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

      window.location.replace("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find(s => s.id === serviceId);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50">
      {/* Header */}
      <div className="text-center pb-6 border-b border-gray-100">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A373]/10 rounded-full mb-3">
          <Sparkles className="w-4 h-4 text-[#D4A373]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4A373]">Book Your Trip</span>
        </div>
        <h2 className="text-2xl font-bold text-[#1E3A3A]">Plan Your Journey</h2>
        <p className="text-sm text-gray-500 mt-1">Select your service and preferences</p>
      </div>

      {/* SERVICES */}
      <div>
        <label className="text-sm font-bold text-gray-700 block mb-3 flex items-center gap-2">
          <Car className="w-4 h-4 text-[#87CEEB]" />
          Choose Service
        </label>

        {loadingServices ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl">
            <p className="text-sm text-gray-400">No services available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setServiceId(s.id)}
                className={`group text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                  serviceId === s.id
                    ? "border-[#4CAF50] bg-gradient-to-r from-[#4CAF50]/10 to-[#87CEEB]/10 shadow-lg shadow-[#4CAF50]/10"
                    : "border-gray-100 hover:border-[#87CEEB]/50 hover:shadow-md hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      serviceId === s.id ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{s.title}</div>
                      {s.subtitle && (
                        <div className="text-xs text-gray-500">{s.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${
                    serviceId === s.id ? "text-[#4CAF50]" : "text-gray-400"
                  }`}>
                    {s.price}
                  </div>
                </div>
                {serviceId === s.id && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-[#4CAF50]">
                    <ChevronRight className="w-3 h-3" />
                    Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DATE */}
      {serviceId && (
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#87CEEB]" />
            Select Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={toISODate(new Date())}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-gray-50/50"
            />
          </div>
          {availableDates.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {availableDates.slice(0, 7).map(d => (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setDate(d.date)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                    date === d.date
                      ? "border-[#4CAF50] bg-[#4CAF50]/10 text-[#4CAF50]"
                      : "border-gray-200 hover:border-[#87CEEB] hover:bg-gray-50"
                  }`}
                >
                  {new Date(d.date).toLocaleDateString("en-US", { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                  <span className="block text-[9px] text-gray-400 mt-0.5">
                    {d.remaining} spots
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TIME SELECTION */}
      {date && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#87CEEB]" />
              Select Time
            </label>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              
              <button
                type="button"
                onClick={switchToManual}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  useManualTime ? "bg-white shadow-md text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Manual
              </button>
            </div>
          </div>

          {!useManualTime ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.length === 0 ? (
                <div className="col-span-full text-center py-6 text-sm text-gray-400 bg-gray-50 rounded-2xl">
                  No slots available
                </div>
              ) : (
                slots.map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={slot.full}
                    onClick={() => setTime(slot.time)}
                    className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                      time === slot.time
                        ? "border-[#4CAF50] bg-[#4CAF50]/10 text-[#4CAF50] shadow-lg shadow-[#4CAF50]/10"
                        : slot.full
                        ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                        : "border-gray-100 hover:border-[#87CEEB] hover:bg-gray-50"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                    {slot.time}
                  </button>
                ))
              )}
            </div>
          ) : (
            <input
              type="time"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-gray-50/50"
            />
          )}
        </div>
      )}

      {/* TRIP DETAILS */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#87CEEB]" />
              From
            </label>
            <input
              placeholder="Pickup location"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-gray-50/50"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4A373]" />
              To
            </label>
            <input
              placeholder="Drop-off location"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-gray-50/50"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-[120px]">
            <label className="text-sm font-bold text-gray-700 block mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#87CEEB]" />
              Passengers
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                
                value={passengers}
                onChange={(e) => handlePassengersChange(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-gray-50/50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                max 4
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer py-2 px-4 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-[#87CEEB]/50 transition-all">
            <input
              type="checkbox"
              checked={hasLuggage}
              onChange={(e) => setHasLuggage(e.target.checked)}
              className="w-5 h-5 rounded-lg border-2 border-gray-300 text-[#4CAF50] focus:ring-[#87CEEB] focus:ring-2"
            />
            <Luggage className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">With luggage</span>
          </label>
        </div>
      </div>

      {/* CUSTOMER INFO */}
      <div className="bg-gray-50/70 rounded-2xl p-6 space-y-4 border-2 border-gray-100/50">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <User className="w-4 h-4 text-[#87CEEB]" />
          Contact Information
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Full Name</label>
            <input
              required
              placeholder="John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Email</label>
            <input
              required
              type="email"
              placeholder="john@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Phone</label>
            <input
              required
              type="tel"
              placeholder="+44 6 00 00 00 00"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Special Requests</label>
            <textarea
              placeholder="Any special requests?"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#87CEEB] focus:ring-2 focus:ring-[#87CEEB]/20 outline-none transition-all bg-white"
            />
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border-2 border-red-100">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={submitting || !serviceId || !date || (!useManualTime ? !time : !manualTime)}
        className="w-full relative overflow-hidden group py-4 rounded-2xl bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all duration-300"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Confirm Booking
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>

      <p className="text-center text-[10px] text-gray-400 font-medium tracking-wide">
        Secure booking • Instant confirmation • 24/7 support
      </p>
    </form>
  );
}