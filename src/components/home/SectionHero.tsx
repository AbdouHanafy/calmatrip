"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ─── TICKER ──────────────────────────────────────────────────────────────── */
function Ticker({ items }: { items: string[] }) {
  return (
    <div className="ticker-wrap">
      <div className="ticker-content">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-dot">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionHero() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════════════════════════════════════ */}
      <section className="relative w-full h-[520px] md:h-[600px] overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/homehero.png"
          alt="Peaceful Tunisian riad courtyard"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Subtle dark overlay — light enough to keep the image vivid */}
        <div className="absolute inset-0 bg-black/5" />

        {/* Centered text content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#6B3A2A] drop-shadow-sm leading-tight max-w-3xl">
            Find Your Peaceful<br />Escape in Tunisia
          </h1>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1B4D3E] text-white font-semibold text-base tracking-wide hover:bg-[#16402F] transition-colors shadow-lg"
          >
            Discover Authentic Experiences
          </Link>
        </div>
      </section>

      {/* ═══════════════ TICKER ═════════════════════════════════════════════ */}
      <div className="py-4" style={{ background: "#0F2828" }}>
        <Ticker
          items={[
            "Enjoy The Calm Promise",
            "Experience Tunisia at the True Local Rate",
          ]}
        />
      </div>
    </>
  );
}

export default SectionHero;