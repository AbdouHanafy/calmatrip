interface ReturnJourneyFieldsProps {
  date: string;
  returnDate: string;
  onReturnDateChange: (date: string) => void;
  returnTime: string;
  onReturnTimeChange: (time: string) => void;
}

export function ReturnJourneyFields({
  date,
  returnDate,
  onReturnDateChange,
  returnTime,
  onReturnTimeChange,
}: ReturnJourneyFieldsProps) {
  return (
    <div className="space-y-5 rounded-2xl border-2 border-calma-terracotta/20 bg-calma-terracotta/5 p-6">
      <h3 className="font-bold text-[#1E3A3A] text-lg">Return Journey</h3>

      <div>
        <label className="text-sm font-bold text-gray-700 block mb-2">Return Date</label>
        <input
          type="date"
          value={returnDate}
          min={date}
          onChange={(e) => onReturnDateChange(e.target.value)}
          className="w-full rounded-2xl border-2 border-gray-100 px-4 py-3.5 outline-none focus:border-calma-terracotta focus:ring-2 focus:ring-calma-terracotta/20"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 block mb-2">Return Time</label>
        <input
          type="time"
          value={returnTime}
          onChange={(e) => onReturnTimeChange(e.target.value)}
          className="w-full rounded-2xl border-2 border-gray-100 px-4 py-3.5 outline-none focus:border-calma-terracotta focus:ring-2 focus:ring-calma-terracotta/20"
        />
      </div>
    </div>
  );
}
