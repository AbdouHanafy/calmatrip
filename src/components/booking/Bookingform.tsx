"use client";
import { useState } from "react";
import Image from "next/image";
import { Sparkles, AlertCircle, ChevronRight } from "lucide-react";
import LocationPickerModal from "@/components/ui/LocationPickerModal";
import { useBookingForm } from "@/hooks/booking/useBookingForm";
import { ServiceSelector } from "./ServiceSelector";
import { TripTypeToggle } from "./TripTypeToggle";
import { DateSelector } from "./DateSelector";
import { TimeSelector } from "./TimeSelector";
import { ReturnJourneyFields } from "./ReturnJourneyFields";
import { TripDetailsFields } from "./TripDetailsFields";
import { CustomerInfoFields } from "./CustomerInfoFields";

export function BookingForm() {
  const form = useBookingForm();
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);

  const onSubmit = (e: React.FormEvent) =>
    form.handleSubmit(e, () => window.location.replace("/dashboard"));

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8 bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50"
    >
      {/* Header */}
      <div className="text-center pb-6 border-b border-gray-100">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D4A373]/10 rounded-full mb-3">
          <Sparkles className="w-4 h-4 text-[#D4A373]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4A373]">
            Book Your Trip
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#1E3A3A]">Plan Your Journey</h2>
        <p className="text-sm text-gray-500 mt-1">Select your service and preferences</p>
      </div>

      <ServiceSelector
        services={form.services}
        loading={form.loadingServices}
        serviceId={form.serviceId}
        onSelect={form.setServiceId}
      />

      <TripTypeToggle tripType={form.tripType} onChange={form.setTripType} />

      {form.serviceId && (
        <DateSelector
          date={form.date}
          onChange={form.setDate}
          availableDates={form.availableDates}
        />
      )}

      {form.date && (
        <TimeSelector
          useManualTime={form.useManualTime}
          onSwitchToManual={form.switchToManual}
          time={form.time}
          onTimeChange={form.setTime}
          manualTime={form.manualTime}
          onManualTimeChange={form.setManualTime}
          slots={form.slots}
        />
      )}

      {form.tripType === "round-trip" && (
        <ReturnJourneyFields
          date={form.date}
          returnDate={form.returnDate}
          onReturnDateChange={form.setReturnDate}
          returnTime={form.returnTime}
          onReturnTimeChange={form.setReturnTime}
        />
      )}

      <TripDetailsFields
        pickupLocation={form.pickupLocation}
        destinationLocation={form.destinationLocation}
        onOpenPickupModal={() => setIsPickupModalOpen(true)}
        onOpenDestinationModal={() => setIsDestinationModalOpen(true)}
        passengers={form.passengers}
        onPassengersChange={form.setPassengers}
        hasLuggage={form.hasLuggage}
        onHasLuggageChange={form.setHasLuggage}
      />

      <CustomerInfoFields
        customerName={form.customerName}
        onCustomerNameChange={form.setCustomerName}
        customerEmail={form.customerEmail}
        onCustomerEmailChange={form.setCustomerEmail}
        customerPhone={form.customerPhone}
        onCustomerPhoneChange={form.setCustomerPhone}
        specialRequests={form.specialRequests}
        onSpecialRequestsChange={form.setSpecialRequests}
      />

      {form.error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border-2 border-red-100">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-600">{form.error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={
          form.submitting ||
          !form.serviceId ||
          !form.date ||
          (!form.useManualTime ? !form.time : !form.manualTime)
        }
        className="group relative w-full overflow-hidden rounded-2xl bg-calma-terracotta py-4 text-lg font-bold text-white transition-colors duration-300 hover:bg-calma-terracotta-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          {form.submitting ? (
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
      </button>

      <div className="relative w-full h-72">
        <Image
          src="/images/explore/giftbooking.png"
          alt="gift booking"
          fill
          sizes="(max-width: 767px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      {/* Modals */}
      <LocationPickerModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        onSelectLocation={(address, lat, lng) => form.setPickupLocation({ address, lat, lng })}
        title="Select pickup location"
      />
      <LocationPickerModal
        isOpen={isDestinationModalOpen}
        onClose={() => setIsDestinationModalOpen(false)}
        onSelectLocation={(address, lat, lng) => form.setDestinationLocation({ address, lat, lng })}
        title="Select destination"
      />

      <p className="text-center text-[10px] text-gray-400 font-medium tracking-wide">
        Secure booking • Instant confirmation • 24/7 support
      </p>
    </form>
  );
}
