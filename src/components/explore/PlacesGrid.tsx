import { Search } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import { PlaceCard } from "./PlaceCard";
import type { Place } from "@/lib/explore/places";
import type { FavoriteType } from "@/hooks/useFavorites";

interface PlacesGridProps {
  places: Place[];
  isFavorited: (type: FavoriteType, id: number) => boolean;
  onToggleFavorite: (type: FavoriteType, id: number) => void;
  onResetFilters: () => void;
}

export function PlacesGrid({
  places,
  isFavorited,
  onToggleFavorite,
  onResetFilters,
}: PlacesGridProps) {
  const { t } = useCalmaLang();

  if (places.length === 0) {
    return (
      <div className="py-32 text-center animate-fade-in">
        <div className="w-24 h-24 bg-calma-cream rounded-full flex items-center justify-center mx-auto mb-8">
          <Search size={32} className="text-calma-taupe/50" />
        </div>
        <h3 className="mb-4 font-fraunces text-3xl font-normal text-calma-ink">
          {t.exp.emptyTitle}
        </h3>
        <p className="text-calma-taupe max-w-md mx-auto mb-10 leading-relaxed">{t.exp.emptySub}</p>
        <button
          onClick={onResetFilters}
          className="px-10 py-4 bg-[#4A667D] text-white rounded-2xl font-bold hover:bg-[#F2994A] transition-all shadow-2xl"
        >
          {t.exp.resetFilters}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {places.map((place, idx) => (
        <PlaceCard
          key={place.id}
          place={place}
          index={idx}
          isFavorited={isFavorited}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
