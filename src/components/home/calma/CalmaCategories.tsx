'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCalmaLang } from '@/lib/calma/i18n';

const IMAGES = ['/images/explore/kairouan_mosque.png', '/images/explore/sidi_bou_said.png', '/images/explore/sahara_camel.png', '/images/explore/carthage_ports.png'];
const SLUGS = ['culture', 'beach', 'desert', 'food'];

function DestinationTile({
  cat,
  image,
  slug,
  className,
  compact = false,
}: {
  cat: { title: string; desc: string; count: string };
  image: string;
  slug: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/explore?category=${slug}`}
      className={`group relative block overflow-hidden rounded-calma-card no-underline shadow-[0_2px_16px_-8px_rgba(20,15,10,.2)] transition-shadow duration-500 hover:shadow-[0_32px_60px_-24px_rgba(20,15,10,.5)] ${className ?? ''}`}
    >
      <Image
        src={image}
        alt={cat.title}
        fill
        sizes={compact ? '(min-width: 1024px) 420px, 100vw' : '(min-width: 1024px) 560px, 100vw'}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top,rgba(20,18,16,.85),rgba(20,18,16,.1) 55%,transparent)' }}
      />
      <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/25 px-3 py-[6px] text-[11px] font-bold text-white backdrop-blur-md">
        {cat.count}
      </div>
      <div className="absolute bottom-5 left-5 right-5 transition-transform duration-500 group-hover:-translate-y-1">
        <h3 className={`mb-1 font-fraunces font-normal leading-[1.15] text-white ${compact ? 'text-[18px]' : 'text-[23px]'}`}>
          {cat.title}
        </h3>
        <p className="m-0 text-[12.5px] leading-[1.45] text-white/[.78]">{cat.desc}</p>
      </div>
    </Link>
  );
}

export default function CalmaCategories() {
  const { t } = useCalmaLang();
  const [main, ...rest] = t.cats;

  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-8 pt-12 sm:px-10">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-calma-terracotta">
            {t.catsKicker}
          </div>
          <h2 className="m-0 font-fraunces text-[clamp(30px,3.6vw,44px)] font-normal tracking-[-0.02em] text-calma-ink">
            {t.catsHeading}
          </h2>
        </div>
        <p className="m-0 max-w-[340px] text-[15.5px] leading-[1.55] text-calma-taupe">{t.catsSub}</p>
      </div>

      {/* Asymmetric grid — one large destination card + a stacked column of smaller ones */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <DestinationTile cat={main} image={IMAGES[0]} slug={SLUGS[0]} className="h-[300px] lg:h-[624px]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {rest.map((cat, i) => (
            <DestinationTile
              key={cat.title}
              cat={cat}
              image={IMAGES[i + 1]}
              slug={SLUGS[i + 1]}
              compact
              className="h-[200px] lg:h-[202.67px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
