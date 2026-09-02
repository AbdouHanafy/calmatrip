import { Search, Filter } from "lucide-react";

interface ClientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export function ClientFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: ClientFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-calma-taupe" />
          <input
            type="text"
            placeholder="Search client by name, email or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-admin-gold focus:ring-2 focus:ring-admin-gold/10"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-admin-gold focus:ring-2 focus:ring-admin-gold/10"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <button
            aria-label="Filtrer"
            className="rounded-xl border border-slate-200 px-4 py-2.5 transition-colors hover:bg-slate-50"
          >
            <Filter className="w-4 h-4 text-calma-taupe" />
          </button>
        </div>
      </div>
    </div>
  );
}
