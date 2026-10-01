"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bus, Clock, Compass, MapPin } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";
import type { HomeActivity } from "@/lib/activities";

export type { HomeActivity };

// Free-text prices ("From 35 TND", "21", "Custom quote") → leading number, or null.
function parsePrice(price: string | null): number | null {
  const match = price?.match(/\d+(?:[.,]\d+)?/);
  return match ? parseFloat(match[0].replace(",", ".")) : null;
}

export default function ActivityCard({ activity }: { activity: HomeActivity }) {
  const { t } = useCalmaLang();
  const price = parsePrice(activity.price);
  const PlaceholderIcon = activity.kind === "service" ? Bus : Compass;

  return (
    <Link href={activity.href} className="group block no-underline">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-calma-sand">
        {activity.image ? (
          <Image
            src={activity.image}
            alt={activity.title}
            fill
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 75vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-calma-ink/35">
            <PlaceholderIcon size={40} strokeWidth={1.4} />
          </div>
        )}
      </div>

      <div className="pt-3">
        {activity.category && (
          <div className="mb-1 text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
            {activity.category}
          </div>
        )}
        <h3 className="m-0 line-clamp-2 text-[16px] font-bold leading-snug text-calma-ink group-hover:underline">
          {activity.title}
        </h3>
        {(activity.duration || activity.place) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-calma-taupe">
            {activity.duration && (
              <span className="inline-flex items-center gap-1">
                <Clock size={13} /> {activity.duration}
              </span>
            )}
            {activity.place && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} /> {activity.place}
              </span>
            )}
          </div>
        )}
        <div className="mt-2 text-[14px] text-calma-ink">
          {price !== null ? (
            <>
              {t.home.from} <span className="text-[16px] font-bold">{price} TND</span>
            </>
          ) : (
            <span className="font-semibold">{t.home.priceOnRequest}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
