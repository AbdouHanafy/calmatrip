"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Package, MapPin, CalendarDays, Landmark } from "lucide-react";
import { CalmaLangProvider } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import PageHeader from "@/components/calma/PageHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import { useFavorites, type FavoriteType } from "@/hooks/useFavorites";

// Mirrors the static mock places in ExplorePage — kept minimal (display fields only).
const STATIC_PLACES: Record<
  number,
  { title: string; image: string; description: string; city: string }
> = {
  1: {
    title: "Great Mosque of Kairouan",
    image: "/images/explore/kairouan_mosque.png",
    description: "One of Islam's oldest mosques with stunning architecture.",
    city: "Kairouan",
  },
  2: {
    title: "Café des Nattes",
    image: "/images/explore/sidi_bou_said.png",
    description: "Legendary café overlooking Sidi Bou Said.",
    city: "Sidi Bou Said",
  },
  3: {
    title: "Sahara Camel Trek",
    image: "/images/explore/sahara_camel.png",
    description: "The golden dunes of Douz on a traditional camel caravan.",
    city: "Douz",
  },
  4: {
    title: "Punic Ports, Carthage",
    image: "/images/explore/carthage_ports.png",
    description: "Ancient naval harbors of Carthage.",
    city: "Carthage",
  },
  5: {
    title: "Chebika Oasis",
    image: "/images/explore/chebika_oasis.png",
    description: "A breathtaking mountain oasis.",
    city: "Tozeur",
  },
  6: {
    title: "El Jem Amphitheatre",
    image: "/images/explore/El Jem Amphitheatre.jpg",
    description: "The world's third largest Roman amphitheatre.",
    city: "Mahdia",
  },
};

interface FavoriteRow {
  itemType: FavoriteType;
  itemId: number;
}

interface CardData {
  key: string;
  type: FavoriteType;
  id: number;
  title: string;
  image: string | null;
  subtitle: string;
  href?: string;
}

interface FavoriteProduct {
  id: number;
  name: string;
  image: string | null;
  price: number;
}

interface FavoriteEvent {
  id: number;
  title: string;
  image: string | null;
  city: string;
}

interface FavoriteMuseum {
  id: number;
  name: string;
  image: string | null;
  city: string;
}

function FavoritesContent() {
  const { toggleFavorite } = useFavorites();
  const [rows, setRows] = useState<FavoriteRow[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: FavoriteRow[]) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (rows.length === 0) {
      setCards([]);
      return;
    }

    const productIds = rows.filter((r) => r.itemType === "product").map((r) => r.itemId);
    const eventIds = new Set(rows.filter((r) => r.itemType === "event").map((r) => r.itemId));
    const museumIds = new Set(rows.filter((r) => r.itemType === "museum").map((r) => r.itemId));
    const placeIds = rows.filter((r) => r.itemType === "place").map((r) => r.itemId);

    Promise.all([
      Promise.all(
        productIds.map((id) => fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null))),
      ),
      eventIds.size > 0 ? fetch("/api/events").then((r) => r.json()) : Promise.resolve([]),
      museumIds.size > 0 ? fetch("/api/museums").then((r) => r.json()) : Promise.resolve([]),
    ]).then(
      ([productResults, allEvents, allMuseums]: [
        { product: FavoriteProduct | null }[],
        FavoriteEvent[],
        FavoriteMuseum[],
      ]) => {
        const productCards: CardData[] = productResults
          .map((r) => r?.product)
          .filter((p): p is FavoriteProduct => Boolean(p))
          .map((p) => ({
            key: `product-${p.id}`,
            type: "product" as FavoriteType,
            id: p.id,
            title: p.name,
            image: p.image,
            subtitle: `${p.price.toFixed(2)} TND`,
            href: `/marketplace/${p.id}`,
          }));

        const eventCards: CardData[] = (Array.isArray(allEvents) ? allEvents : [])
          .filter((e) => eventIds.has(e.id))
          .map((e) => ({
            key: `event-${e.id}`,
            type: "event" as FavoriteType,
            id: e.id,
            title: e.title,
            image: e.image,
            subtitle: e.city,
            href: "/explore",
          }));

        const museumCards: CardData[] = (Array.isArray(allMuseums) ? allMuseums : [])
          .filter((m) => museumIds.has(m.id))
          .map((m) => ({
            key: `museum-${m.id}`,
            type: "museum" as FavoriteType,
            id: m.id,
            title: m.name,
            image: m.image,
            subtitle: m.city,
            href: "/explore",
          }));

        const placeCards: CardData[] = placeIds
          .filter((id) => STATIC_PLACES[id])
          .map((id) => ({
            key: `place-${id}`,
            type: "place" as FavoriteType,
            id,
            title: STATIC_PLACES[id].title,
            image: STATIC_PLACES[id].image,
            subtitle: STATIC_PLACES[id].city,
            href: "/explore",
          }));

        setCards([...productCards, ...placeCards, ...eventCards, ...museumCards]);
      },
    );
  }, [rows]);

  const remove = async (card: CardData) => {
    setCards((prev) => prev.filter((c) => c.key !== card.key));
    setRows((prev) => prev.filter((r) => !(r.itemType === card.type && r.itemId === card.id)));
    await toggleFavorite(card.type, card.id);
  };

  const typeIcon: Record<FavoriteType, React.ElementType> = {
    product: Package,
    place: MapPin,
    event: CalendarDays,
    museum: Landmark,
    service: MapPin,
  };

  return (
    <>
      <CalmaHeader active="explore" />
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title="Mes favoris"
          subtitle={`${cards.length} élément${cards.length !== 1 ? "s" : ""} enregistré${cards.length !== 1 ? "s" : ""}`}
          crumbs={[{ label: "Accueil", href: "/" }, { label: "Mes favoris" }]}
        />

        <section className="mx-auto max-w-[1240px] px-4 pt-2 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-calma-sand" />
              ))}
            </div>
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart size={44} strokeWidth={1.4} className="mb-3 text-calma-ink/30" />
              <h3 className="m-0 mb-1 text-[20px] font-bold text-calma-ink">
                Aucun favori pour le moment
              </h3>
              <p className="m-0 max-w-[460px] text-[15px] text-calma-taupe">
                Clique sur le cœur d&apos;un produit, d&apos;une activité, d&apos;un musée ou
                d&apos;un événement pour l&apos;ajouter ici.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((card) => {
                const Icon = typeIcon[card.type];
                return (
                  <div key={card.key} className="group relative">
                    <Link href={card.href ?? "#"} className="block no-underline">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-calma-sand">
                        {card.image ? (
                          <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 90vw"
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-calma-ink/35">
                            <Icon size={40} strokeWidth={1.4} />
                          </div>
                        )}
                      </div>
                      <div className="pt-3">
                        <div className="mb-1 flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
                          <Icon size={12} /> {card.type}
                        </div>
                        <h3 className="m-0 line-clamp-2 text-[16px] font-bold leading-snug text-calma-ink group-hover:underline">
                          {card.title}
                        </h3>
                        <p className="mb-0 mt-1 text-[13.5px] text-calma-taupe">{card.subtitle}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => remove(card)}
                      aria-label="Retirer des favoris"
                      className="absolute end-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm transition-transform hover:scale-105"
                    >
                      <Heart size={17} className="fill-calma-terracotta text-calma-terracotta" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <CalmaFooter />
    </>
  );
}

export default function FavoritesPage() {
  return (
    <CalmaLangProvider>
      <FavoritesContent />
    </CalmaLangProvider>
  );
}
