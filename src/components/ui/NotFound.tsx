"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Search, MapPin, ShoppingBag, Compass } from "lucide-react";

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
    router.push(query.trim() ? `/explore?search=${encodeURIComponent(query.trim())}` : "/explore");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-calma-sand px-6 py-20 text-center font-hanken">
      <p className="mb-3 font-fraunces text-[88px] font-normal leading-none text-calma-olive/20">
        404
      </p>
      <h1 className="mb-3 font-fraunces text-3xl font-normal text-calma-ink">
        Cette page n&apos;existe pas
      </h1>
      <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-calma-taupe">
        Le lien est peut-être cassé ou la page a été déplacée. Voici comment retrouver votre chemin.
      </p>

      <form onSubmit={onSearch} className="mb-10 w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-calma-taupe" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une destination, une excursion…"
            className="h-12 w-full rounded-full border border-calma-border bg-white pl-12 pr-4 text-sm text-calma-ink outline-none transition-colors focus:border-calma-terracotta"
          />
        </div>
      </form>

      <div className="mb-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex flex-col items-center gap-2 rounded-2xl border border-calma-border bg-white p-5 no-underline transition-colors hover:border-calma-terracotta/50 hover:bg-calma-terracotta/[.04]"
          >
            <s.icon className="h-5 w-5 text-calma-terracotta" />
            <span className="text-sm font-semibold text-calma-ink">{s.label}</span>
            <span className="text-xs text-calma-taupe">{s.desc}</span>
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white no-underline shadow-[0_8px_20px_-6px_rgba(242,153,74,.65)]"
        style={{ backgroundColor: "#F2994A" }}
      >
        <Home className="h-4 w-4" />
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
