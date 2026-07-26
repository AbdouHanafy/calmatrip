interface TripTypeToggleProps {
  tripType: "one-way" | "round-trip";
  onChange: (type: "one-way" | "round-trip") => void;
}

export function TripTypeToggle({ tripType, onChange }: TripTypeToggleProps) {
  return (
    <div>
      <label className="text-sm font-bold text-gray-700 block mb-3">Trip Type</label>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("one-way")}
          className={`rounded-2xl border-2 p-5 transition-all ${
            tripType === "one-way"
              ? "border-[#4CAF50] bg-[#4CAF50]/10 shadow-md"
              : "border-gray-200 hover:border-[#87CEEB]"
          }`}
        >
          <h3 className="font-bold text-lg">One Trip</h3>
          <p className="text-sm text-gray-500 mt-2">One-way transfer</p>
        </button>

        <button
          type="button"
          onClick={() => onChange("round-trip")}
          className={`rounded-2xl border-2 p-5 transition-all ${
            tripType === "round-trip"
              ? "border-[#4CAF50] bg-[#4CAF50]/10 shadow-md"
              : "border-gray-200 hover:border-[#87CEEB]"
          }`}
        >
          <h3 className="font-bold text-lg">Round Trip</h3>
          <p className="text-sm text-gray-500 mt-2">Outbound + Return</p>
        </button>
      </div>
    </div>
  );
}
