'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

interface AnimatedStatProps {
  value: string;
  className?: string;
}

/** Animates the leading integer of a stat string (e.g. "500+", "98%", "24/7") when scrolled into view. */
export default function AnimatedStat({ value, className }: AnimatedStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);

  const match = value.match(/\d+/);
  const target = match ? parseInt(match[0], 10) : null;

  useEffect(() => {
    if (!inView || target === null) {
      if (!inView) return;
      setDisplay(value);
      return;
    }
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(value.replace(/\d+/, String(current)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion, target, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
