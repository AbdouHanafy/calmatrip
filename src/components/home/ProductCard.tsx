"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { HomeProduct } from "@/lib/activities";

export default function ProductCard({ product }: { product: HomeProduct }) {
  return (
    <Link href={`/marketplace/${product.id}`} className="group block no-underline">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-calma-sand">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 75vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="pt-3">
        <div className="mb-1 text-[12px] font-semibold uppercase tracking-[.04em] text-calma-taupe">
          {product.category}
        </div>
        <h3 className="m-0 line-clamp-2 text-[16px] font-bold leading-snug text-calma-ink group-hover:underline">
          {product.name}
        </h3>
        <div className="mt-2 text-[16px] font-bold text-calma-ink">{product.price} TND</div>
      </div>
    </Link>
  );
}
