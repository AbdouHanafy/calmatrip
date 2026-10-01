"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, ShoppingBag, Compass } from "lucide-react";
import { CalmaLangProvider } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";

const SHORTCUTS = [
  {
    href: "/services",
    label: "Nos services",
    desc: "Transferts, excursions, activités",
    icon: Compass,
  },
  {
    href: "/explore",
    label: "Explorer",
    desc: "Destinations et expériences en Tunisie",
    icon: MapPin,
  },
  { href: "/marketplace", label: "Marketplace", desc: "Artisanat tunisien", icon: ShoppingBag },
];

export function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  };

  return (
    <CalmaLangProvider>
      <CalmaHeader active="home" />
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 py-16 text-center font-hanken">
        <p className="m-0 mb-2 text-[80px] font-bold leading-none tracking-[-0.03em] text-calma-ink/15">
          404
        </p>
        <h1 className="m-0 mb-3 text-[28px] font-bold tracking-[-0.01em] text-calma-ink">
          Cette page n&apos;existe pas
        </h1>
        <p className="mx-auto mb-8 mt-0 max-w-md text-[15px] leading-relaxed text-calma-taupe">
          Le lien est peut-être cassé ou la page a été déplacée. Voici comment retrouver votre
          chemin.
        </p>

        <form onSubmit={onSearch} className="mb-8 w-full max-w-md">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-calma-taupe"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une destination, une excursion…"
              className="h-12 w-full rounded-full border border-calma-ink/20 bg-white ps-11 pe-4 text-[15px] text-calma-ink outline-none transition-colors placeholder:text-calma-taupe focus:border-calma-ink"
            />
          </div>
        </form>

        <div className="mb-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {SHORTCUTS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-calma-ink/10 p-5 no-underline transition-colors hover:border-calma-ink/40"
            >
              <s.icon size={22} strokeWidth={1.7} className="text-calma-olive" />
              <span className="text-[15px] font-bold text-calma-ink">{s.label}</span>
              <span className="text-[13px] text-calma-taupe">{s.desc}</span>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-calma-olive"
        >
          Retour à l&apos;accueil
        </Link>
      </main>
      <CalmaFooter />
    </CalmaLangProvider>
  );
}
