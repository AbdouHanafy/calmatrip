import { Navigation } from "lucide-react";
import { motion } from "motion/react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { CATEGORY_IDS, CATEGORY_ICONS } from "@/lib/explore/places";

interface ActiveFilter {
  id: string;
  label: string;
  onClear: () => void;
}

interface ExploreFiltersProps {
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  budgetLimit: number;
  onBudgetChange: (budget: number) => void;
  onGeolocate: () => void;
  viewMode: "list" | "map";
  onViewModeChange: (mode: "list" | "map") => void;
  activeFilters: ActiveFilter[];
  onClearAll: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function ExploreFilters({
  selectedCategory,
  onCategoryChange,
  cities,
  selectedCity,
  onCityChange,
  budgetLimit,
  onBudgetChange,
  onGeolocate,
  viewMode,
  onViewModeChange,
  activeFilters,
  onClearAll,
  sortBy,
  onSortChange,
}: ExploreFiltersProps) {
  const { t } = useCalmaLang();
  const categories = CATEGORY_IDS.map((id, i) => ({
    id,
    label: [
      t.exp.catAll,
      t.exp.catFood,
      t.exp.catSights,
      t.exp.catActivities,
      t.exp.catHidden,
      t.exp.catEvents,
      t.exp.catMuseums,
    ][i],
    icon: CATEGORY_ICONS[i],
  }));

  return (
    <section className="max-w-7xl mx-auto px-6 relative z-20">
      <div
        className="flex flex-col gap-6 rounded-[28px] border border-calma-olive/10 bg-calma-cream/95 p-4 backdrop-blur-2xl md:p-6"
        style={{ boxShadow: "0 20px 50px -24px rgba(42,38,34,.3)" }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Category Scroll — sliding pill */}
          <div className="flex gap-1.5 min-w-0 max-w-full overflow-x-auto pb-1 calma-scrollbar-hide rounded-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className="relative flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-calma-taupe transition-colors data-[active=true]:text-white"
                data-active={selectedCategory === cat.id}
              >
                {selectedCategory === cat.id && (
                  <motion.span
                    layoutId="explore-cat-pill"
                    className="absolute inset-0 rounded-full bg-calma-olive"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <cat.icon size={15} className="relative z-[1]" />
                <span className="relative z-[1]">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="h-8 w-px bg-calma-olive/10 hidden md:block" />

            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-white px-4 py-2.5 rounded-full border border-calma-olive/15 text-xs font-bold text-calma-ink outline-none focus:border-calma-terracotta transition-colors cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === "All Cities" ? t.exp.allCities : city}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 bg-white px-3.5 py-2.5 rounded-full border border-calma-olive/15">
              <span className="text-[10px] font-bold text-calma-taupe uppercase tracking-widest mr-1">
                {t.exp.budgetLabel}
              </span>
              {[1, 2, 3].map((b) => (
                <button
                  key={b}
                  onClick={() => onBudgetChange(b)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all
                    ${budgetLimit === b ? "bg-calma-terracotta text-white shadow-sm" : "bg-calma-sand text-calma-taupe hover:text-calma-ink"}
                  `}
                >
                  {"$".repeat(b)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onGeolocate}
              className="p-3 bg-white rounded-full text-calma-taupe hover:bg-calma-olive hover:text-white transition-colors border border-calma-olive/15"
              title={t.exp.useLocation}
            >
              <Navigation size={17} />
            </button>
            <div className="bg-calma-sand p-1 rounded-full flex gap-1">
              <button
                onClick={() => onViewModeChange("list")}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${viewMode === "list" ? "bg-white shadow-sm text-calma-ink" : "text-calma-taupe hover:text-calma-ink"}`}
              >
                {t.exp.listLabel}
              </button>
              <button
                onClick={() => onViewModeChange("map")}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${viewMode === "map" ? "bg-white shadow-sm text-calma-ink" : "text-calma-taupe hover:text-calma-ink"}`}
              >
                {t.exp.mapLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Active Tags & Sorting */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-calma-olive/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-calma-taupe uppercase tracking-widest mr-2">
                {t.exp.filtersLabel}:
              </span>
              {activeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={filter.onClear}
                  className="px-3 py-1.5 bg-calma-terracotta/10 text-calma-terracotta text-[11px] font-bold rounded-full border border-calma-terracotta/20 flex items-center gap-2 hover:bg-calma-terracotta hover:text-white transition-all group"
                >
                  {filter.label}
                  <span className="text-lg leading-none opacity-50 group-hover:opacity-100">
                    &times;
                  </span>
                </button>
              ))}
              <button
                onClick={onClearAll}
                className="text-[11px] font-bold text-calma-taupe hover:text-calma-ink underline underline-offset-4 ml-2"
              >
                {t.exp.clearAll}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-calma-taupe uppercase tracking-widest">
                {t.exp.sortLabel}:
              </span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="text-[11px] font-bold text-calma-ink outline-none bg-transparent cursor-pointer hover:text-calma-terracotta"
              >
                <option value="Popularity">{t.exp.sortPopularity}</option>
                <option value="Rating">{t.exp.sortRating}</option>
                <option value="Reviews">{t.exp.sortReviews}</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
