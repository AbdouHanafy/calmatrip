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
      <div className="py-20 text-center">
        <Search size={40} strokeWidth={1.4} className="mx-auto mb-3 text-calma-ink/30" />
        <h3 className="m-0 text-[20px] font-bold text-calma-ink">{t.exp.emptyTitle}</h3>
        <p className="mx-auto mb-6 mt-2 max-w-md text-[15px] leading-relaxed text-calma-taupe">
          {t.exp.emptySub}
        </p>
        <button
          onClick={onResetFilters}
          className="rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-calma-olive"
        >
          {t.exp.resetFilters}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          isFavorited={isFavorited}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
