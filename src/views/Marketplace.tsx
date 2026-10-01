"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { MarketplaceHeader } from "@/components/marketplace/Marketplaceheader";
import { ProductCard } from "@/components/marketplace/Productcard";
import { Product } from "@/components/marketplace/Marketplacecontext";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import PageHeader from "@/components/calma/PageHeader";
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
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={t.mkt.heroTitle}
          subtitle={t.mkt.heroSub}
          image="/images/explore/carthage_ports.png"
          imageAlt="Artisanat tunisien"
          crumbs={[{ label: t.cnt.breadcrumbHome, href: "/" }, { label: t.navMarket }]}
        />

        <MarketplaceHeader categories={categories} />

        <div className="mx-auto max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between">
            <p className="m-0 text-[14px] text-calma-taupe">
              {`${products.length} ${products.length !== 1 ? t.mkt.productsWord : t.mkt.productWord}`}
            </p>
            <select
              value={sort}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams?.toString());
                params.set("sort", e.target.value);
                router.push(`/marketplace?${params.toString()}`);
              }}
              className="h-10 cursor-pointer rounded-full border border-calma-ink/20 bg-white px-4 text-[14px] font-semibold text-calma-ink outline-none transition-colors hover:border-calma-ink/45 focus:border-calma-ink"
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
            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-5 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <CalmaFooter />
    </>
  );
}

export default function MarketplacePage({ products, categories }: MarketplaceContentProps) {
  return (
    <CalmaLangProvider>
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <MarketplaceContent products={products} categories={categories} />
      </Suspense>
    </CalmaLangProvider>
  );
}
