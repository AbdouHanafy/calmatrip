"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { useMarketplace, Product } from "@/components/marketplace/Marketplacecontext";
import { ProductCard } from "@/components/marketplace/Productcard";
import { CalmaLangProvider, useCalmaLang } from "@/lib/calma/i18n";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaFooter from "@/components/calma/CalmaFooter";
import PageHeader from "@/components/calma/PageHeader";

const wrap = "mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8";

function ProductDetailContent() {
  const { t } = useCalmaLang();
  const params = useParams();
  const { addToCart, toggleWishlist, isWishlisted } = useMarketplace();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${params?.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data.product);
        setRelated(data.related || []);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <>
        <CalmaHeader active="marketplace" />
        <div
          className={`${wrap} grid min-h-[60vh] grid-cols-1 gap-8 pt-10 font-hanken md:grid-cols-2`}
        >
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-calma-sand" />
          <div className="space-y-4">
            <div className="h-5 w-1/3 animate-pulse rounded-lg bg-calma-sand" />
            <div className="h-9 w-2/3 animate-pulse rounded-lg bg-calma-sand" />
            <div className="h-24 animate-pulse rounded-lg bg-calma-sand" />
          </div>
        </div>
        <CalmaFooter />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <CalmaHeader active="marketplace" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-white px-6 text-center font-hanken">
          <p className="m-0 text-[18px] font-bold text-calma-ink">Produit introuvable</p>
          <Link
            href="/marketplace"
            className="rounded-full bg-calma-ink px-6 py-3 text-[15px] font-semibold text-white no-underline hover:bg-calma-olive"
          >
            Retour à la marketplace
          </Link>
        </div>
        <CalmaFooter />
      </>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;
  const availableSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const hasSizes = availableSizes.length > 0;

  const images: string[] = (() => {
    if (!product.image) return ["/placeholder-product.png"];
    try {
      const parsed = JSON.parse(product.image);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    return [product.image];
  })();

  const handleAdd = () => {
    addToCart(product, qty, selectedSize ?? undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <CalmaHeader active="marketplace" />
      <main className="min-h-screen bg-white pb-12 font-hanken">
        <PageHeader
          title={product.name}
          crumbs={[
            { label: t.cnt.breadcrumbHome, href: "/" },
            { label: t.navMarket, href: "/marketplace" },
            {
              label: product.category,
              href: `/marketplace?category=${encodeURIComponent(product.category)}`,
            },
            { label: product.name },
          ]}
        />

        <section className={wrap}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-calma-sand">
                <Image
                  src={images[activeImg]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              {images.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      aria-label={`${product.name} ${i + 1}`}
                      aria-pressed={activeImg === i}
                      className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-opacity ${
                        activeImg === i
                          ? "border-calma-ink"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-1 text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
                {product.category}
              </div>
              <div className="mb-4 text-[28px] font-bold leading-tight text-calma-ink">
                {product.price.toFixed(2)} TND
              </div>

              <p className="mb-6 mt-0 text-[15.5px] leading-relaxed text-calma-ink/80">
                {product.description}
              </p>

              {hasSizes && (
                <div className="mb-6">
                  <div className="mb-2 text-[14px] font-semibold text-calma-ink">Taille</div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                        aria-pressed={selectedSize === size}
                        className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors ${
                          selectedSize === size
                            ? "border-calma-ink bg-calma-ink text-white"
                            : "border-calma-ink/20 bg-white text-calma-ink hover:border-calma-ink/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-5 text-[14px] font-semibold">
                {outOfStock ? (
                  <span className="text-red-600">{t.mkt.outOfStock}</span>
                ) : product.stock <= 5 ? (
                  <span className="text-[#856B00]">
                    {t.mkt.lowStock.replace("{n}", String(product.stock))}
                  </span>
                ) : (
                  <span className="text-calma-success">En stock</span>
                )}
              </div>

              {!outOfStock && (
                <div className="mb-5 inline-flex items-center rounded-full border border-calma-ink/20">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="-"
                    className="grid h-11 w-11 place-items-center rounded-full text-calma-ink hover:bg-calma-sand"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-[15px] font-semibold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    aria-label="+"
                    className="grid h-11 w-11 place-items-center rounded-full text-calma-ink hover:bg-calma-sand"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={outOfStock}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-calma-ink px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-calma-olive disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                  {added ? "Ajouté !" : t.mkt.addToCart}
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={wishlisted ? t.mkt.removeFromWishlist : t.mkt.addToWishlist}
                  className="grid h-12 w-12 place-items-center rounded-full border border-calma-ink/20 transition-colors hover:border-calma-ink/50"
                >
                  <Heart
                    size={20}
                    className={
                      wishlisted ? "fill-calma-terracotta text-calma-terracotta" : "text-calma-ink"
                    }
                  />
                </button>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="m-0 mb-5 text-[22px] font-bold tracking-[-0.01em] text-calma-ink sm:text-[26px]">
                Produits similaires
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-5 lg:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <CalmaFooter />
    </>
  );
}

export default function ProductDetailPage() {
  return (
    <CalmaLangProvider>
      <ProductDetailContent />
    </CalmaLangProvider>
  );
}
