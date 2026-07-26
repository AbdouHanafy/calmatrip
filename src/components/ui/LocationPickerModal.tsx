"use client";
import { GoogleMap, Marker, Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useState, useRef } from "react";
import { X, MapPin } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "1rem",
};

const defaultCenter = { lat: 36.8065, lng: 10.1815 };

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (address: string, lat: number, lng: number) => void;
  title: string;
}

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  title,
}: LocationPickerModalProps) {
  const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_ID_GOOGLEM_APS;

  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_ID_GOOGLEM_APS is not defined");
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries,
  });

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedPosition({ lat, lng });
        setAddress(place.formatted_address || place.name || "");
      }
    }
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedPosition({ lat, lng });
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      });
    }
  };

  const handleConfirm = () => {
    if (selectedPosition && address) {
      onSelectLocation(address, selectedPosition.lat, selectedPosition.lng);
      onClose();
    }
  };

  if (!isOpen) return null;

  if (loadError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-red-500">Error loading Google Maps. Please check your API key.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <div className="bg-white rounded-2xl p-6 text-center">
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <Autocomplete
            onLoad={onLoadAutocomplete}
            onPlaceChanged={onPlaceChanged}
            options={{
              fields: ["formatted_address", "geometry", "name"],
              types: ["geocode"], // 👈 IMPORTANT: uniquement adresses
            }}
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for an address..."
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-transparent mb-4"
            />
          </Autocomplete>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={selectedPosition || defaultCenter}
            zoom={12}
            onClick={onMapClick}
          >
            {selectedPosition && <Marker position={selectedPosition} />}
          </GoogleMap>
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-[#D4A373]" />
              <span>{address || "Click on the map or search for an address"}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-100">
          <button
            onClick={handleConfirm}
            disabled={!selectedPosition}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#D4A373] to-[#E9B35F] text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
