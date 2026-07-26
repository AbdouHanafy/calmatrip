"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Particle {
  id: number;
  left: number;
  bottom: number;
  size: number;
  duration: number;
  delay: number;
}

export function AuthBackground({ reduceMotion }: { reduceMotion: boolean | null }) {
  const [particles, setParticles] = useState<Particle[] | null>(null);

  useEffect(() => {
    setParticles(
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        bottom: Math.random() * 60,
        size: 2 + Math.round(Math.random() * 3),
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 10,
      })),
    );
  }, []);

  return (
    <>
      {/* Cinematic Tunisian background with slow Ken Burns zoom */}
      <div className={`absolute inset-0 ${reduceMotion ? "" : "calma-hero-kenburns"}`}>
        <Image
          src="/images/explore/kairouan_mosque.png"
          alt="Grande Mosquée de Kairouan, Tunisie"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Warm cinematic gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg,rgba(36,26,14,.82) 0%,rgba(36,51,63,.62) 45%,rgba(24,18,12,.88) 100%)",
        }}
      />
      {/* Soft radial vignette centered behind the card */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 46%, rgba(20,14,8,.2) 0%, rgba(20,14,8,.55) 100%)",
        }}
      />
      {/* Warm atmospheric glow */}
      <div
        className="pointer-events-none absolute -right-[10%] -top-[10%] h-[55%] w-[50%] rounded-full opacity-[.25] blur-[120px]"
        style={{ background: "radial-gradient(circle, #F2994A 0%, transparent 70%)" }}
      />

      {/* Slow floating dust particles */}
      {particles && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="calma-dust absolute rounded-full bg-white/60"
              style={{
                left: `${p.left}%`,
                bottom: `${p.bottom}%`,
                width: p.size,
                height: p.size,
                animation: `calma-dust ${p.duration}s linear ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
