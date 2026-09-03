import { MapPin } from "lucide-react";
import { motion } from "motion/react";
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
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header + category filter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#D2B38B]">
              {t.svc.offerKicker}
            </p>
            <h2 className="font-fraunces text-3xl font-normal leading-tight text-[#15242E] lg:text-4xl">
              {t.svc.offerTitle1}
              <br />
              {t.svc.offerTitle2}
            </h2>
          </div>

          {/* Category pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-1.5 rounded-full border border-calma-olive/10 bg-white p-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className="relative rounded-full px-4 py-2 text-sm font-semibold capitalize text-calma-taupe transition-colors duration-200 data-[active=true]:text-white"
                  data-active={activeCategory === cat}
                >
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="services-cat-pill"
                      className="absolute inset-0 rounded-full bg-calma-olive"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-[1]">{cat}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bandeau de recherche active */}
        {q && (
          <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-[#F0E2CE] bg-white px-5 py-3.5">
            <p className="text-sm text-[#5E7480]">
              {filtered.length > 0 ? (
                <>
                  {filtered.length} {filtered.length > 1 ? t.svc.resultsWord : t.svc.resultWord}{" "}
                  {t.svc.forWord} <b className="font-fraunces text-[#15242E]">“{q}”</b>
                </>
              ) : (
                <>
                  {t.svc.noResultsFor} <b className="font-fraunces text-[#15242E]">“{q}”</b>{" "}
                  {t.svc.noResultsHint}
                </>
              )}
            </p>
            <button
              type="button"
              onClick={onClearQuery}
              className="ml-auto rounded-full border border-[#F0E2CE] px-4 py-1.5 text-xs uppercase tracking-[0.12em] text-[#5E7480] transition-colors hover:border-[#D2B38B] hover:text-[#15242E]"
            >
              {t.svc.clearSearch}
            </button>
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">
              {q ? t.svc.emptySearch : t.svc.emptyCategory}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => (
              <ServiceCard key={service.id} service={service} onBook={onBook} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
