"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { PackageSearch } from "lucide-react";
import { MarketplaceHeader } from "@/components/marketplace/Marketplaceheader";
import { ProductCard } from "@/components/marketplace/Productcard";
import { Product } from "@/components/marketplace/Marketplacecontext";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";

interface MarketplaceContentProps {
  products: Product[];
  categories: string[];
}

function MarketplaceContent({ products, categories }: MarketplaceContentProps) {
  const { t } = useCalmaLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams?.get("sort") || "newest";

  return (
    <>
      <CalmaHeader active="marketplace" />
      <div className="min-h-screen bg-calma-sand font-hanken">
        {/* ── Hero — short, photo-backed, sand texture ── */}
        <section className="relative flex min-h-[260px] items-center justify-center overflow-hidden px-6 py-14 text-center sm:px-10">
          <Image
            src="/images/explore/carthage_ports.png"
            alt="Artisanat tunisien"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(42,38,34,.72) 0%,rgba(42,38,34,.6) 45%,rgba(42,38,34,.8) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(100deg,transparent 0 26px,#F8F5F0 26px 27px)",
            }}
          />
          <div className="relative z-[2] mx-auto max-w-[640px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-calma-cream backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta" />
              {t.mkt.eyebrow}
            </div>
            <h1 className="mb-4 text-balance font-fraunces text-[clamp(32px,4.4vw,48px)] font-normal leading-[1.05] tracking-[-0.02em] text-calma-cream">
              {t.mkt.heroTitle}
            </h1>
            <p className="mx-auto max-w-[520px] text-pretty text-[16px] leading-[1.65] text-white/80">
              {t.mkt.heroSub}
            </p>
          </div>
        </section>

        <MarketplaceHeader categories={categories} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-calma-taupe">
              {`${products.length} ${products.length !== 1 ? t.mkt.productsWord : t.mkt.productWord}`}
            </p>
            <select
              value={sort}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams?.toString());
                params.set("sort", e.target.value);
                router.push(`/marketplace?${params.toString()}`);
              }}
              className="text-sm border border-calma-olive/15 rounded-full px-4 py-2 bg-white text-calma-ink outline-none focus:border-calma-terracotta transition-colors"
            >
              <option value="newest">{t.mkt.sortNewest}</option>
              <option value="price_asc">{t.mkt.sortPriceAsc}</option>
              <option value="price_desc">{t.mkt.sortPriceDesc}</option>
              <option value="name">{t.mkt.sortNameAz}</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <PackageSearch className="w-12 h-12 text-calma-taupe/40 mb-4" />
              <h3 className="text-lg font-semibold text-calma-ink mb-1">{t.mkt.emptyTitle}</h3>
              <p className="text-sm text-calma-taupe">{t.mkt.emptySub}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <CalmaFooter />
    </>
  );
}

export default function MarketplacePage({ products, categories }: MarketplaceContentProps) {
  return (
    <CalmaLangProvider>
      <Suspense fallback={<div className="min-h-screen bg-calma-sand" />}>
        <MarketplaceContent products={products} categories={categories} />
      </Suspense>
    </CalmaLangProvider>
  );
}
