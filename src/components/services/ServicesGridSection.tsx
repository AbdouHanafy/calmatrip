import { MapPin } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { ServiceCard } from "./ServiceCard";
import type { MappedService } from "@/lib/services/mapService";

interface ServicesGridSectionProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  q: string;
  onClearQuery: () => void;
  filtered: MappedService[];
  onBook: (id: string) => void;
}

export function ServicesGridSection({
  categories,
  activeCategory,
  onCategoryChange,
  q,
  onClearQuery,
  filtered,
  onBook,
}: ServicesGridSectionProps) {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:px-8">
      <h2 className="m-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]">
        {t.svc.offerTitle1} {t.svc.offerTitle2}
      </h2>

      {categories.length > 1 && (
        <ul className="-mx-4 mb-0 mt-4 flex list-none gap-2 overflow-x-auto px-4 pb-1 ps-4 calma-scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <li key={cat} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onCategoryChange(cat)}
                  aria-pressed={active}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-2.5 text-[14px] font-semibold capitalize transition-colors ${
                    active
                      ? "border-calma-ink bg-calma-ink text-white"
                      : "border-calma-ink/15 bg-white text-calma-ink hover:border-calma-ink/45 hover:bg-calma-sand/40"
                  }`}
                >
                  {cat}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {q && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-calma-ink/10 px-4 py-3">
          <p className="m-0 text-[14px] text-calma-taupe">
            {filtered.length > 0 ? (
              <>
                {filtered.length} {filtered.length > 1 ? t.svc.resultsWord : t.svc.resultWord}{" "}
                {t.svc.forWord} <b className="text-calma-ink">“{q}”</b>
              </>
            ) : (
              <>
                {t.svc.noResultsFor} <b className="text-calma-ink">“{q}”</b> {t.svc.noResultsHint}
              </>
            )}
          </p>
          <button
            type="button"
            onClick={onClearQuery}
            className="ms-auto rounded-full border border-calma-ink/20 px-4 py-1.5 text-[13px] font-semibold text-calma-ink transition-colors hover:border-calma-ink"
          >
            {t.svc.clearSearch}
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <MapPin size={40} strokeWidth={1.4} className="mx-auto mb-3 text-calma-ink/30" />
          <p className="m-0 text-[15px] text-calma-taupe">
            {q ? t.svc.emptySearch : t.svc.emptyCategory}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} onBook={onBook} />
          ))}
        </div>
      )}
    </section>
  );
}
