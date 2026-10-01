import Image from "next/image";
import { Star, MapPin, CalendarDays, Clock, Heart } from "lucide-react";
import { getFavoriteKey, type Place } from "@/lib/explore/places";
import type { FavoriteType } from "@/hooks/useFavorites";

interface PlaceCardProps {
  place: Place;
  isFavorited: (type: FavoriteType, id: number) => boolean;
  onToggleFavorite: (type: FavoriteType, id: number) => void;
}

// Same card language as the homepage's ActivityCard: 4:3 photo, category, title,
// one meta line. Favourite heart floats on the photo.
export function PlaceCard({ place, isFavorited, onToggleFavorite }: PlaceCardProps) {
  const fav = getFavoriteKey(place);
  const favorited = isFavorited(fav.type, fav.id);

  return (
    <article className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-calma-sand">
        <Image
          src={place.image}
          alt={place.title}
          fill
          sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(fav.type, fav.id);
          }}
          aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute end-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm transition-transform hover:scale-105"
        >
          <Heart
            size={17}
            className={favorited ? "fill-calma-terracotta text-calma-terracotta" : "text-calma-ink"}
          />
        </button>
      </div>

      <div className="pt-3">
        <div className="mb-1 text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
          {place.category}
        </div>
        <h3 className="m-0 line-clamp-2 text-[16px] font-bold leading-snug text-calma-ink">
          {place.title}
        </h3>
        <p className="mb-0 mt-1.5 line-clamp-2 text-[13.5px] leading-snug text-calma-taupe">
          {place.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-calma-taupe">
          {place.rating !== undefined && (
            <span className="inline-flex items-center gap-1 font-semibold text-calma-ink">
              <Star size={13} className="fill-calma-gold text-calma-gold" />
              {place.rating}
              {place.reviews !== undefined && (
                <span className="font-normal text-calma-taupe">({place.reviews})</span>
              )}
            </span>
          )}
          {place.startDate ? (
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={13} />
              {new Date(place.startDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          ) : place.openingHours ? (
            <span className="inline-flex items-center gap-1">
              <Clock size={13} /> {place.openingHours}
            </span>
          ) : place.duration ? (
            <span className="inline-flex items-center gap-1">
              <Clock size={13} /> {place.duration}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {place.city}
          </span>
        </div>
      </div>
    </article>
  );
}
