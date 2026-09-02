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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-calma-taupe" />
          <input
            type="text"
            placeholder="Search by client name, email or service..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-admin-gold focus:ring-2 focus:ring-admin-gold/10"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-admin-gold focus:ring-2 focus:ring-admin-gold/10"
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
