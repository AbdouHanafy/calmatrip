import { Search, Download } from "lucide-react";
import { SERVICE_CATEGORIES } from "./types";

interface ServiceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  onExportCsv: () => void;
}

export function ServiceFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onExportCsv,
}: ServiceFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 border border-calma-border">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-calma-taupe" />
          <input
            type="text"
            placeholder="Search for a service..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2.5 border border-calma-border rounded-xl focus:ring-2 focus:ring-[#F2994A] focus:border-transparent bg-white"
          >
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All categories" : cat}
              </option>
            ))}
          </select>
          <button
            onClick={onExportCsv}
            aria-label="Exporter en CSV"
            className="px-4 py-2.5 border border-calma-border rounded-xl hover:bg-calma-sand transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4 text-calma-taupe" />
          </button>
        </div>
      </div>
    </div>
  );
}
