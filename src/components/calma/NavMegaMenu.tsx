"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

interface MegaMenuItem {
  href: string;
  title: string;
  description: string;
  image: string | null;
}

// Small in-memory cache — every page renders a header, so without this the
// mega-menu would re-fetch on every navigation even though the list rarely
// changes within a session.
const cache: Partial<Record<"services" | "marketplace", MegaMenuItem[]>> = {};

async function loadItems(kind: "services" | "marketplace"): Promise<MegaMenuItem[]> {
  if (cache[kind]) return cache[kind]!;
  if (kind === "services") {
    const res = await fetch("/api/services");
    if (!res.ok) return [];
    const services = (await res.json()) as Array<{
      id: number;
      title: string;
      subtitle?: string | null;
      description: string;
      image?: string | null;
      active?: boolean;
    }>;
    const items = services
      .filter((s) => s.active !== false)
      .slice(0, 6)
      .map((s) => ({
        href: `/services/${s.id}`,
        title: s.title,
        description: (s.subtitle || s.description || "").replace(/<[^>]+>/g, "").slice(0, 90),
        image: s.image || null,
      }));
    cache.services = items;
    return items;
  }
  const res = await fetch("/api/products");
  if (!res.ok) return [];
  const { products, categories } = (await res.json()) as {
    products: Array<{ category: string; image?: string | null }>;
    categories: string[];
  };
  const items = categories.slice(0, 6).map((cat) => {
    const sample = products.find((p) => p.category === cat);
    const count = products.filter((p) => p.category === cat).length;
    return {
      href: `/marketplace?category=${encodeURIComponent(cat)}`,
      title: cat,
      description: `${count} produit${count !== 1 ? "s" : ""} disponible${count !== 1 ? "s" : ""}`,
      image: sample?.image || null,
    };
  });
  cache.marketplace = items;
  return items;
}

export function NavMegaMenu({
  href,
  label,
  kind,
  baseClassName,
  isActive,
}: {
  href: string;
  label: string;
  kind: "services" | "marketplace";
  baseClassName: string;
  isActive: boolean;
}) {
  const { t } = useCalmaLang();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MegaMenuItem[] | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open && items === null) loadItems(kind).then(setItems);
  }, [open, items, kind]);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <Link
        href={href}
        className={`${baseClassName} inline-flex items-center gap-1 ${isActive ? "bg-white/[.12] font-semibold text-white" : ""}`}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </Link>

      {open && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="absolute start-0 top-full z-[60] mt-3 w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-calma-olive-deeper/95 shadow-[0_24px_60px_-16px_rgba(8,12,20,.6)] backdrop-blur-xl"
        >
          <div className="max-h-[420px] overflow-y-auto p-2">
            {items === null && <div className="px-4 py-6 text-center text-sm text-white/50">…</div>}
            {items?.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-white/50">{t.mkt.emptyTitle}</div>
            )}
            {items?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl p-2.5 no-underline transition-colors hover:bg-white/[.08]"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/10">
                  {item.image && (
                    <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-hanken text-[14px] font-semibold text-white">
                    {item.title}
                  </div>
                  <div className="truncate text-[12.5px] text-white/60">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href={href}
            className="block border-t border-white/10 px-4 py-3 text-center text-[13px] font-semibold text-calma-terracotta-soft no-underline hover:text-white"
          >
            {label} →
          </Link>
        </div>
      )}
    </div>
  );
}
