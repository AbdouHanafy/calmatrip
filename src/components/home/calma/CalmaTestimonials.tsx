"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { useCalmaLang } from "@/lib/calma/i18n";

function wrappedOffset(index: number, current: number, length: number) {
  let d = index - current;
  if (d > length / 2) d -= length;
  if (d < -length / 2) d += length;
  return d;
}

const COUNTRY_FLAGS: Record<string, string> = {
  France: "🇫🇷",
  Italie: "🇮🇹",
  Italy: "🇮🇹",
  Belgique: "🇧🇪",
  Belgium: "🇧🇪",
};

function flagFor(role: string) {
  const country = role.split(",").pop()?.trim() ?? "";
  return COUNTRY_FLAGS[country] ?? "";
}

export default function CalmaTestimonials() {
  const { t } = useCalmaLang();
  const testis = t.testis;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (dir: number) => {
    setCurrent((c) => (c + dir + testis.length) % testis.length);
  };

  useEffect(() => {
    if (paused || reduceMotion || testis.length < 2) return;
    autoRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % testis.length);
    }, 6000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [paused, reduceMotion, testis.length]);

  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-8 pt-28 sm:px-10">
      <h2 className="mb-12 text-center font-fraunces text-[clamp(28px,3.4vw,40px)] font-normal tracking-[-0.02em] text-calma-ink">
        {t.testiHeading}
      </h2>

      <div
        className="relative mx-auto h-[320px] max-w-[900px] sm:h-[290px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ perspective: reduceMotion ? undefined : 1400 }}
        >
          <AnimatePresence initial={false}>
            {testis.map((ts, i) => {
              const offset = wrappedOffset(i, current, testis.length);
              if (Math.abs(offset) > 1) return null;

              const isCenter = offset === 0;
              const target = reduceMotion
                ? { opacity: isCenter ? 1 : 0, x: 0, rotateY: 0, scale: 1 }
                : {
                    opacity: isCenter ? 1 : 0.5,
                    x: `${offset * 62}%`,
                    rotateY: offset * -32,
                    scale: isCenter ? 1 : 0.82,
                  };

              return (
                <motion.div
                  key={ts.name}
                  className="absolute inset-x-0 top-0 mx-auto w-full max-w-[560px] cursor-pointer rounded-calma-card border border-white/60 bg-calma-cream/85 p-[30px_28px] backdrop-blur-xl"
                  style={{
                    transformStyle: "preserve-3d",
                    zIndex: isCenter ? 3 : 2,
                    pointerEvents: isCenter ? "auto" : "none",
                    boxShadow: isCenter ? "0 32px 60px -28px rgba(42,38,34,.4)" : "none",
                  }}
                  initial={false}
                  animate={target}
                  transition={{ type: "spring", stiffness: 220, damping: 28 }}
                  onClick={() => !isCenter && setCurrent(i)}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-[15px] tracking-[2px] text-calma-gold">★★★★★</div>
                    <div className="flex items-center gap-1 rounded-full bg-calma-olive/[.06] px-2.5 py-1 text-[10.5px] font-semibold text-calma-olive">
                      <BadgeCheck size={13} className="text-calma-terracotta" />
                      Voyageur vérifié
                    </div>
                  </div>
                  <p className="text-pretty mb-[22px] mt-4 font-fraunces text-[17px] italic leading-[1.5] text-calma-ink">
                    &ldquo;{ts.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-calma-terracotta font-fraunces text-base font-semibold text-calma-cream">
                      {ts.init}
                    </div>
                    <div>
                      <div className="text-[14.5px] font-bold text-calma-olive">{ts.name}</div>
                      <div className="flex items-center gap-1.5 text-[12.5px] text-calma-taupe">
                        <span>{flagFor(ts.role)}</span>
                        {ts.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full bg-calma-cream text-calma-olive shadow-lg transition-colors hover:bg-white sm:-translate-x-5"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 translate-x-2 items-center justify-center rounded-full bg-calma-cream text-calma-olive shadow-lg transition-colors hover:bg-white sm:translate-x-5"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {testis.map((ts, i) => (
          <button
            key={ts.name}
            type="button"
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${
              i === current
                ? "h-2.5 w-8 bg-calma-terracotta"
                : "h-2.5 w-2.5 bg-calma-olive/20 hover:bg-calma-olive/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
