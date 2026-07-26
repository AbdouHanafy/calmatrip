"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, ArrowLeft, Minus, Plus, Check } from "lucide-react";
import { useMarketplace, Product } from "@/components/marketplace/Marketplacecontext";
import { ProductCard } from "@/components/marketplace/Productcard";
import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footre";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useMarketplace();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0); // ← moved here, before any early return
  const { cartCount, wishlist } = useMarketplace();

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
      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 animate-pulse rounded-2xl" />
        <div className="space-y-4">
          <div className="h-6 w-1/3 bg-gray-100 animate-pulse rounded-lg" />
          <div className="h-10 w-2/3 bg-gray-100 animate-pulse rounded-lg" />
          <div className="h-24 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <p className="text-gray-500">Produit introuvable</p>
        <Link href="/marketplace" className="text-[#87CEEB] underline text-sm">
          Retour à la marketplace
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;
  const availableSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const hasSizes = availableSizes.length > 0;

  const images = (() => {
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
    setSizeError(false);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <nav
            aria-label="Fil d'Ariane"
            className="mb-6 flex items-center gap-1.5 text-xs text-gray-400"
          >
            <Link href="/" className="hover:text-gray-700">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/marketplace" className="hover:text-gray-700">
              Marketplace
            </Link>
            <span>/</span>
            <Link
              href={`/marketplace?category=${encodeURIComponent(product.category)}`}
              className="hover:text-gray-700"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-600">{product.name}</span>
          </nav>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
            {/* Actions (wishlist + cart + commandes) */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 order-2 sm:order-1">
              {/* Wishlist */}
              <Link
                href="/marketplace/wishlist"
                aria-label="Favoris"
                className="relative flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-700" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/marketplace/cart"
                aria-label="Panier"
                className="relative flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#4CAF50] text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Orders */}
              <Link
                href="/marketplace/orders"
                className="flex-1 sm:flex-none w-full sm:w-auto text-center text-sm font-medium text-gray-600 hover:text-[#87CEEB] px-3 py-2 rounded-xl transition-colors"
              >
                Mes commandes
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Image gallery */}
            <div className="flex flex-col gap-3">
              {/* Main image */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <Image
                  src={images[activeImg]}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImg === i
                          ? "border-[#4CAF50] shadow-md"
                          : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <p className="text-2xl font-bold text-[#4CAF50] mb-4">
                {product.price.toFixed(2)} TND
              </p>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {hasSizes && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Taille{" "}
                    {sizeError && (
                      <span className="text-red-500 text-xs font-normal ml-1">
                        (optionnel — choisis si tu en as une)
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                          selectedSize === size
                            ? "border-[#4CAF50] bg-[#4CAF50]/10 text-[#4CAF50]"
                            : "border-gray-200 text-gray-500 hover:border-[#87CEEB]/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                {outOfStock ? (
                  <span className="text-sm font-medium text-red-500">Rupture de stock</span>
                ) : product.stock <= 5 ? (
                  <span className="text-sm font-medium text-[#856B00]">
                    Plus que {product.stock} en stock
                  </span>
                ) : (
                  <span className="text-sm font-medium text-[#4CAF50]">En stock</span>
                )}
              </div>

              {!outOfStock && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center border border-gray-200 rounded-xl">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-xl"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-xl"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  disabled={outOfStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#87CEEB] to-[#4CAF50] text-white font-semibold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                >
                  {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  {added ? "Ajouté !" : "Ajouter au panier"}
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Favoris"
                  className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Produits similaires</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
