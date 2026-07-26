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
    <div className="bg-white rounded-2xl shadow-lg p-4 border border-calma-border">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-calma-taupe" />
          <input
            type="text"
            placeholder="Search client by name, email or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2.5 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent bg-white"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <button
            aria-label="Filtrer"
            className="px-4 py-2.5 border border-calma-border rounded-xl hover:bg-calma-sand transition-colors"
          >
            <Filter className="w-4 h-4 text-calma-taupe" />
          </button>
        </div>
      </div>
    </div>
  );
}
