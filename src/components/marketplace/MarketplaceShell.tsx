"use client";
import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import PageHeader from "@/components/calma/PageHeader";
import { useMarketplace } from "@/components/marketplace/Marketplacecontext";

interface MarketplaceShellProps {
  title: string;
  width?: "narrow" | "wide";
  children: React.ReactNode;
}

const iconLink =
  "relative grid h-10 w-10 place-items-center rounded-full border border-calma-ink/20 bg-white text-calma-ink transition-colors hover:border-calma-ink/45";

function ShellContent({ title, width = "narrow", children }: MarketplaceShellProps) {
  const { t } = useCalmaLang();
  const { cartCount, wishlist } = useMarketplace();
  const column = width === "wide" ? "max-w-[1240px]" : "max-w-[860px]";

  return (
    <>
      <CalmaHeader active="marketplace" />
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <div className={`mx-auto ${column} px-4 sm:px-6 lg:px-8`}>
          <PageHeader
            flush
            title={title}
            crumbs={[
              { label: t.cnt.breadcrumbHome, href: "/" },
              { label: t.navMarket, href: "/marketplace" },
              { label: title },
            ]}
          />
          <div className="-mt-2 mb-6 flex items-center justify-end gap-2">
            <Link
              href="/marketplace/wishlist"
              aria-label={t.mkt.wishlistLabel}
              className={iconLink}
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-calma-terracotta px-1 text-[11px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link href="/marketplace/cart" aria-label={t.mkt.cartLabel} className={iconLink}>
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-calma-ink px-1 text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/marketplace/orders"
              className="rounded-full border border-calma-ink/20 px-4 py-2.5 text-[14px] font-semibold text-calma-ink no-underline transition-colors hover:border-calma-ink/45"
            >
              {t.mkt.myOrders}
            </Link>
          </div>
          {children}
        </div>
      </main>
      <CalmaFooter />
    </>
  );
}

export default function MarketplaceShell(props: MarketplaceShellProps) {
  return (
    <CalmaLangProvider>
      <ShellContent {...props} />
    </CalmaLangProvider>
  );
}
