"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCalmaLang } from "@/lib/calma/i18n";

// City values match STATIC_CITIES in lib/explore/places.ts so ?city= filters
// hit; El Jem isn't a city there, so it goes through free-text search instead.
const DESTINATIONS = [
  { image: "/images/tunisia.jpeg", href: "/explore?city=Sidi%20Bou%20Said" },
  { image: "/images/explore/carthage_ports.png", href: "/explore?city=Carthage" },
  { image: "/images/explore/kairouan_mosque.png", href: "/explore?city=Kairouan" },
  { image: encodeURI("/images/explore/El Jem Amphitheatre.jpg"), href: "/explore?search=El%20Jem" },
  { image: "/images/explore/chebika_oasis.png", href: "/explore?city=Tozeur" },
  { image: "/images/explore/sahara_camel.png", href: "/explore?city=Douz" },
];

export default function HomeDestinations() {
  const { t } = useCalmaLang();

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-5 mt-0 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]">
        {t.home.destinationsHeading}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {DESTINATIONS.map((d, i) => {
          const name = t.home.destinations[i];
          return (
            <Link
              key={d.href}
              href={d.href}
              className="group relative block aspect-[4/3] overflow-hidden rounded-xl no-underline sm:aspect-[16/10]"
            >
              <Image
                src={d.image}
                alt={name}
                fill
                sizes="(min-width: 1024px) 400px, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 to-60%" />
              <span className="absolute bottom-3 start-3 text-[16px] font-bold text-white sm:bottom-4 sm:start-4 sm:text-[20px]">
                {name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
