import { Search } from "lucide-react";

interface BookingFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export function BookingFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: BookingFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 border border-calma-border">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-calma-taupe" />
          <input
            type="text"
            placeholder="Search by client name, email or service..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent transition-all"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2.5 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent bg-white"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}
