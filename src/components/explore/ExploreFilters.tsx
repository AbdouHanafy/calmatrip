import { Navigation } from "lucide-react";
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
      t.exp.catHotels,
      t.exp.catEvents,
      t.exp.catMuseums,
    ][i],
    icon: CATEGORY_ICONS[i],
  }));

  const selectCls =
    "h-10 cursor-pointer rounded-full border border-calma-ink/20 bg-white px-4 text-[14px] font-semibold text-calma-ink outline-none transition-colors hover:border-calma-ink/45 focus:border-calma-ink";

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-5 sm:px-6 lg:px-8">
      <ul className="-mx-4 m-0 flex list-none gap-2 overflow-x-auto px-4 pb-1 calma-scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {categories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <li key={cat.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2.5 text-[14px] font-semibold transition-colors ${
                  active
                    ? "border-calma-ink bg-calma-ink text-white"
                    : "border-calma-ink/15 bg-white text-calma-ink hover:border-calma-ink/45 hover:bg-calma-sand/40"
                }`}
              >
                <cat.icon size={16} strokeWidth={1.8} />
                {cat.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className={selectCls}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city === "All Cities" ? t.exp.allCities : city}
            </option>
          ))}
        </select>

        <div className="flex h-10 items-center gap-1.5 rounded-full border border-calma-ink/20 bg-white px-3">
          <span className="me-1 text-[12px] font-semibold text-calma-taupe">
            {t.exp.budgetLabel}
          </span>
          {[1, 2, 3].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => onBudgetChange(b)}
              aria-pressed={budgetLimit === b}
              className={`grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-[12px] font-bold transition-colors ${
                budgetLimit === b
                  ? "bg-calma-ink text-white"
                  : "bg-calma-sand text-calma-taupe hover:text-calma-ink"
              }`}
            >
              {"$".repeat(b)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onGeolocate}
          title={t.exp.useLocation}
          aria-label={t.exp.useLocation}
          className="grid h-10 w-10 place-items-center rounded-full border border-calma-ink/20 bg-white text-calma-ink transition-colors hover:border-calma-ink/45"
        >
          <Navigation size={16} />
        </button>

        <div className="ms-auto flex rounded-full border border-calma-ink/20 bg-white p-0.5">
          {(["list", "map"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              aria-pressed={viewMode === mode}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                viewMode === mode
                  ? "bg-calma-ink text-white"
                  : "text-calma-taupe hover:text-calma-ink"
              }`}
            >
              {mode === "list" ? t.exp.listLabel : t.exp.mapLabel}
            </button>
          ))}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-calma-ink/10 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold text-calma-taupe">
              {t.exp.filtersLabel}:
            </span>
            {activeFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={filter.onClear}
                className="inline-flex items-center gap-1.5 rounded-full border border-calma-ink/20 px-3 py-1 text-[13px] font-semibold text-calma-ink transition-colors hover:border-calma-ink"
              >
                {filter.label}
                <span aria-hidden className="text-[16px] leading-none text-calma-taupe">
                  &times;
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={onClearAll}
              className="ms-1 text-[13px] font-semibold text-calma-taupe underline underline-offset-4 hover:text-calma-ink"
            >
              {t.exp.clearAll}
            </button>
          </div>

          <label className="flex items-center gap-2 text-[13px] font-semibold text-calma-taupe">
            {t.exp.sortLabel}:
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="cursor-pointer bg-transparent text-[13px] font-semibold text-calma-ink outline-none"
            >
              <option value="Popularity">{t.exp.sortPopularity}</option>
              <option value="Rating">{t.exp.sortRating}</option>
              <option value="Reviews">{t.exp.sortReviews}</option>
            </select>
          </label>
        </div>
      )}
    </section>
  );
}
