"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import CalmaHeader from "@/components/calma/CalmaHeader";
import CalmaPromoTicker from "@/components/home/calma/CalmaPromoTicker";
import { useCalmaLang, type CalmaDict } from "@/lib/calma/i18n";
import {
  IconTemple,
  IconArch,
  IconParasol,
  IconDuneSun,
  IconBowl,
  IconAdventure,
} from "@/components/calma/icons";

// Focused down to the 6 strongest, most legible experiences for a cleaner wave.
const CATEGORY_ICONS = [IconTemple, IconArch, IconParasol, IconDuneSun, IconBowl, IconAdventure];
const CATEGORY_SLUGS = ["culture", "medina", "beach", "desert", "food", "adventure"];
const CATEGORY_LABELS: ((t: CalmaDict) => string)[] = [
  (t) => t.icCulture,
  (t) => t.icMedina,
  (t) => t.icBeach,
  (t) => t.icDesert,
  (t) => t.icFood,
  (t) => t.icAdv,
];
// Smooth symmetric wave: rotation ramps evenly, height rises gently to the center and back down.
const WAVE = [
  { rotate: -9, y: 4 },
  { rotate: -5, y: -10 },
  { rotate: -2, y: -18 },
  { rotate: 2, y: -18 },
  { rotate: 5, y: -10 },
  { rotate: 9, y: 4 },
];
const CARD_SIZE = 92;

// Rotating hero background — cycles through these every 5s.
const HERO_IMAGES = [
  "/images/hero/sea.png",
  "/images/hero/sahara.png",
  "/images/hero/color.png",
  "/images/hero/sea1.png",
];

interface Particle {
  id: number;
  left: number;
  bottom: number;
  size: number;
  duration: number;
  delay: number;
  accent: boolean;
}

export default function CalmaHero() {
  const { t } = useCalmaLang();
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[] | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 110]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveImage((i) => (i + 1) % HERO_IMAGES.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setParticles(
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        bottom: Math.random() * 38,
        size: 2 + Math.round(Math.random() * 3),
        duration: 9 + Math.random() * 7,
        delay: Math.random() * 8,
        accent: i % 3 === 0,
      })),
    );
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    const bg = bgRef.current;
    const row = rowRef.current;
    if (!el || !bg) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      bg.style.transform = `translate(${cx * -22}px, ${cy * -15}px)`;
      if (row) row.style.transform = `translate(${cx * 10}px, ${cy * 6}px)`;
      raf = requestAnimationFrame(tick);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-auto overflow-hidden md:h-[84vh] md:min-h-[640px] md:max-h-[840px]"
      style={{ backgroundColor: "#3A5164" }}
    >
      <motion.div className="absolute inset-0" style={{ y: parallaxY, opacity: parallaxOpacity }}>
        {/* Slow cinematic Ken Burns zoom — separate layer from the mouse-parallax translate below */}
        <div
          className={`absolute inset-0 origin-center ${reduceMotion ? "" : "calma-hero-kenburns"}`}
        >
          <div
            ref={bgRef}
            className="absolute inset-0 origin-center will-change-transform"
            style={{ transition: "transform .12s ease-out" }}
          >
            {HERO_IMAGES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt="Paysage tunisien"
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover transition-opacity duration-1000 ease-in-out ${
                  i === activeImage ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Dark blue-grey cinematic scrim — preserves the landscape while carrying the brand's tertiary color into the hero */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background: "rgba(36,51,63,.48)",
        }}
      />
      {/* Soft blue-grey radial scrim behind the text block — just enough for AA contrast, not a wall of black */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background: "rgba(28,40,50,.12)",
        }}
      />
      {/* Mobile-only scrim — lighter than desktop so the landscape reads clearly, plus a soft edge vignette */}
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background: "rgba(36,51,63,.34)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background: "rgba(20,18,16,.12)",
        }}
      />
      {/* Atmospheric golden-hour glow, upper right — adds depth without darkening the frame */}
      <div
        className="pointer-events-none absolute -right-[10%] -top-[15%] h-[60%] w-[55%] rounded-full opacity-[.22] blur-[120px]"
        style={{ backgroundColor: "#E8B978" }}
      />
      {/* Cool ambient falloff, lower left — balances the warm glow and deepens the frame */}
      <div
        className="pointer-events-none absolute -bottom-[20%] -left-[10%] h-[55%] w-[50%] rounded-full opacity-[.16] blur-[110px]"
        style={{ backgroundColor: "#24333F" }}
      />

      {particles && (
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden will-change-transform md:block">
          {particles.map((p) => (
            <div
              key={p.id}
              className="calma-dust absolute rounded-full"
              style={{
                left: `${p.left}%`,
                bottom: `${p.bottom}%`,
                width: p.size,
                height: p.size,
                background: p.accent ? "rgba(242,153,74,.5)" : "rgba(255,255,255,.55)",
                animation: `calma-dust ${p.duration}s linear ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Curved transition into the sand-colored page body below */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] block w-full"
        style={{ height: 56 }}
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,56 C360,0 1080,0 1440,56 L1440,56 L0,56 Z" fill="#F1EBE1" />
      </svg>

      <CalmaPromoTicker />
      <CalmaHeader active="home" variant="overlay" withTicker />

      <div className="pointer-events-none absolute inset-0 z-10 hidden flex-col items-center justify-center px-6 pb-[164px] pt-16 text-center md:flex">
        <motion.div
          className="pointer-events-auto max-w-[760px]"
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[.16em] text-calma-cream backdrop-blur-md"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,.4)" }}
            initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta" />
            {t.heroEyebrow}
          </motion.div>
          <h1
            className="mb-8 text-balance font-space text-[clamp(48px,5.6vw,80px)] font-extrabold leading-[1.03] tracking-[-0.03em] text-calma-cream"
            style={{ textShadow: "0 6px 44px rgba(0,0,0,.4)" }}
          >
            {t.heroTitle}{" "}
            <span className="not-italic text-calma-terracotta-soft">{t.heroTitleEm}</span>
          </h1>
          <p
            className="mx-auto max-w-[500px] text-pretty font-hanken text-[18px] font-normal leading-[1.75] text-white/80"
            style={{ textShadow: "0 1px 14px rgba(0,0,0,.4)" }}
          >
            {t.heroSub}
          </p>
        </motion.div>

        <div className="pointer-events-auto absolute inset-x-0 bottom-[152px] overflow-x-auto px-4 [scrollbar-width:none] sm:flex sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          <div
            ref={rowRef}
            className="flex w-max items-end gap-4 will-change-transform sm:w-auto sm:gap-6"
          >
            {CATEGORY_ICONS.map((Icon, i) => {
              const w = WAVE[i];
              return (
                <motion.div
                  key={CATEGORY_SLUGS[i]}
                  className="flex-none"
                  style={reduceMotion ? undefined : { rotate: w.rotate }}
                  animate={reduceMotion ? undefined : { y: [w.y - 6, w.y + 6, w.y - 6] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }
                  }
                  whileHover={{
                    rotate: 0,
                    y: -14,
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 320, damping: 20 },
                  }}
                >
                  <Link
                    href={`/explore?category=${CATEGORY_SLUGS[i]}`}
                    style={{ width: CARD_SIZE }}
                    className="group flex flex-col items-center gap-2.5 rounded-2xl border border-white/[.16] bg-white/[.10] p-3.5 no-underline shadow-[0_20px_40px_-16px_rgba(10,8,6,.6)] backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/[.18]"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/[.14] transition-colors duration-300 group-hover:bg-calma-terracotta/70">
                      <Icon size={18} stroke="#F8F5F0" />
                    </span>
                    <span className="text-center text-[11px] font-semibold leading-tight text-white sm:text-[11.5px]">
                      {CATEGORY_LABELS[i](t)}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile-only hero content — compact, single-viewport layout. Desktop/tablet block above (md:flex) is untouched. */}
      <div className="relative z-10 flex flex-col items-center px-5 pb-10 pt-[92px] text-center md:hidden">
        <motion.div
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.08] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-calma-cream backdrop-blur-md"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,.4)" }}
          initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-calma-terracotta" />
          {t.heroEyebrow}
        </motion.div>

        <motion.h1
          className="mb-4 w-full text-balance font-space text-[clamp(28px,8vw,38px)] font-extrabold leading-[1.12] tracking-[-0.02em] text-calma-cream"
          style={{ textShadow: "0 6px 44px rgba(0,0,0,.4)" }}
          initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.heroTitle}{" "}
          <span className="not-italic text-calma-terracotta-soft">{t.heroTitleEm}</span>
        </motion.h1>

        <motion.p
          className="mx-auto mb-5 w-full max-w-[300px] line-clamp-2 text-pretty font-hanken text-[15px] font-normal leading-[1.5] text-white/85"
          style={{ textShadow: "0 1px 14px rgba(0,0,0,.4)" }}
          initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.heroSub}
        </motion.p>

        <motion.div
          className="flex w-full justify-start gap-2.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] snap-x snap-mandatory sm:justify-center [&::-webkit-scrollbar]:hidden"
          initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {CATEGORY_ICONS.map((Icon, i) => (
            <Link
              key={CATEGORY_SLUGS[i]}
              href={`/explore?category=${CATEGORY_SLUGS[i]}`}
              className="flex h-[74px] w-[68px] flex-none snap-start flex-col items-center justify-center gap-1.5 rounded-xl border border-white/[.18] bg-white/[.12] no-underline backdrop-blur-md transition-transform active:scale-95"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/[.16]">
                <Icon size={14} stroke="#F8F5F0" />
              </span>
              <span className="px-1 text-center text-[9.5px] font-semibold leading-tight text-white">
                {CATEGORY_LABELS[i](t)}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
