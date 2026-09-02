import { MapPin, Users, Luggage } from "lucide-react";
import type { LocationValue } from "./types";

interface TripDetailsFieldsProps {
  pickupLocation: LocationValue;
  destinationLocation: LocationValue;
  onOpenPickupModal: () => void;
  onOpenDestinationModal: () => void;
  passengers: number;
  onPassengersChange: (updater: (p: number) => number) => void;
  hasLuggage: boolean;
  onHasLuggageChange: (value: boolean) => void;
}

export function TripDetailsFields({
  pickupLocation,
  destinationLocation,
  onOpenPickupModal,
  onOpenDestinationModal,
  passengers,
  onPassengersChange,
  hasLuggage,
  onHasLuggageChange,
}: TripDetailsFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pickup location */}
        <div>
          <label className="font-sans-clean text-white text-xs uppercase tracking-wider block mb-2">
            Pickup location
          </label>
          <div
            onClick={onOpenPickupModal}
            className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-[#D4A373]/50 transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#D4A373] shrink-0" />
            <span className="font-sans-clean text-sm text-white flex-1">
              {pickupLocation.address || "Choose a location"}
            </span>
          </div>
        </div>

        {/* Destination */}
        <div>
          <label className="font-sans-clean text-white text-xs uppercase tracking-wider block mb-2">
            Destination
          </label>
          <div
            onClick={onOpenDestinationModal}
            className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-[#1E6091]/50 transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#1E6091] shrink-0" />
            <span className="font-sans-clean text-sm text-white flex-1">
              {destinationLocation.address || "Hammamet, Sousse, Djerba..."}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div>
          <label className="text-sm font-bold text-gray-700 block mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-calma-terracotta" />
            Passengers
          </label>

          <div className="flex items-center justify-between border-2 border-gray-100 rounded-2xl bg-gray-50 px-3 py-2">
            <button
              type="button"
              onClick={() => onPassengersChange((p) => Math.max(1, p - 1))}
              className="w-10 h-10 rounded-xl bg-white border hover:bg-gray-100 text-xl font-bold"
            >
              −
            </button>

            <span className="text-lg font-bold text-gray-800">{passengers}</span>

            <button
              type="button"
              onClick={() => onPassengersChange((p) => Math.min(4, p + 1))}
              className="w-10 h-10 rounded-xl bg-white border hover:bg-gray-100 text-xl font-bold"
            >
              +
            </button>
          </div>

          <p className="mt-2 text-xs text-gray-400">Maximum 4 passengers</p>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 py-2 transition-all hover:border-calma-terracotta/50">
          <input
            type="checkbox"
            checked={hasLuggage}
            onChange={(e) => onHasLuggageChange(e.target.checked)}
            className="h-5 w-5 rounded-lg border-2 border-gray-300 text-calma-terracotta focus:ring-2 focus:ring-calma-terracotta/20"
          />
          <Luggage className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">With luggage</span>
        </label>
      </div>
    </div>
  );
}
