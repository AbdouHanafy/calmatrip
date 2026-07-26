import Image from "next/image";
import { Star, MapPin, CalendarDays, Clock, Heart } from "lucide-react";
import { getFavoriteKey, type Place } from "@/lib/explore/places";
import type { FavoriteType } from "@/hooks/useFavorites";

interface PlaceCardProps {
  place: Place;
  index: number;
  isFavorited: (type: FavoriteType, id: number) => boolean;
  onToggleFavorite: (type: FavoriteType, id: number) => void;
}

export function PlaceCard({ place, index, isFavorited, onToggleFavorite }: PlaceCardProps) {
  const fav = getFavoriteKey(place);
  const favorited = isFavorited(fav.type, fav.id);

  return (
    <div
      className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_40px_80px_-30px_rgba(30,58,58,0.15)] transition-all duration-700 border border-transparent hover:border-[#F2994A]/10 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-72 overflow-hidden">
        <Image
          src={place.image}
          alt={place.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
        />
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-[#4A667D] shadow-xl">
            {place.category}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(fav.type, fav.id);
          }}
          aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-xl backdrop-blur-md transition-transform hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 ${favorited ? "fill-[#F2994A] text-[#F2994A]" : "text-[#4A667D]"}`}
          />
        </button>
        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex gap-2">
            {place.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#4A667D]/40 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-tighter rounded-md border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between mb-5">
          {place.rating !== undefined ? (
            <div className="flex items-center gap-1.5 bg-calma-sand px-3 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-[#F2994A] text-[#F2994A]" />
              <span className="text-sm font-black text-calma-ink">{place.rating}</span>
              {place.reviews !== undefined && (
                <span className="text-[10px] text-calma-taupe font-bold uppercase">
                  ({place.reviews})
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-calma-sand px-3 py-1.5 rounded-full">
              <MapPin size={14} className="text-[#F2994A]" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-calma-ink">
                {place.city}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-calma-taupe text-[11px] font-bold uppercase tracking-wide">
            {place.startDate ? (
              <>
                <CalendarDays size={14} className="text-[#F2994A]" />{" "}
                {new Date(place.startDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </>
            ) : place.openingHours ? (
              <>
                <Clock size={14} className="text-[#F2994A]" /> {place.openingHours}
              </>
            ) : place.duration ? (
              <>
                <Clock size={14} className="text-[#F2994A]" /> {place.duration}
              </>
            ) : (
              <>
                <MapPin size={14} className="text-[#F2994A]" /> {place.city}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
