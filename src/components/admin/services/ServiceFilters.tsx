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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-calma-taupe" />
          <input
            type="text"
            placeholder="Search for a service..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-admin-gold focus:ring-2 focus:ring-admin-gold/10"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-admin-gold focus:ring-2 focus:ring-admin-gold/10"
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
            className="rounded-xl border border-slate-200 px-4 py-2.5 transition-colors hover:bg-slate-50"
            title="Export CSV"
          >
            <Download className="w-4 h-4 text-calma-taupe" />
          </button>
        </div>
      </div>
    </div>
  );
}
