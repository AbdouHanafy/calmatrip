'use client';

import { ArrowRight, Phone } from "lucide-react";

// Zellige pattern (réutilisé)
function ZelligePattern({ className }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="zellige-cta"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="30,2 58,15 58,45 30,58 2,45 2,15"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <polygon
            points="30,12 48,21 48,39 30,48 12,39 12,21"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            opacity="0.4"
          />
          <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zellige-cta)" />
    </svg>
  );
}

export default function CTASection() {
  return (
    <section
      className="relative py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1E3A3A 0%, #2A4F4F 40%, #3D6B6B 100%)",
      }}
    >
      {/* Pattern */}
      <ZelligePattern className="text-[#D4A373] opacity-[0.08]" />

      {/* Glow background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212,163,115,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="w-6 h-px bg-[#D4A373]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4A373] font-medium">
            Start the adventure
          </span>
          <div className="w-6 h-px bg-[#D4A373]" />
        </div>

        {/* Title */}
        <h2 className="text-[clamp(3rem,7vw,5.5rem)] font-bold text-white leading-[0.95]">
          Ready to explore
        </h2>

        <h2 className="text-[clamp(3rem,7vw,5.5rem)] font-light italic leading-[0.95] mb-10 text-transparent bg-clip-text bg-gradient-to-r from-[#FAEDCD] to-[#D4A373]">
          Tunisia?
        </h2>

        {/* Text */}
        <p className="text-white/70 text-base max-w-xl mx-auto mb-12 leading-relaxed">
          Book now and enjoy premium transport and travel services across Tunisia.
          Response guaranteed within 30 minutes.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/services"
            className="group px-10 py-5 bg-[#D4A373] text-[#1E3A3A] uppercase tracking-[0.2em] text-sm font-bold flex items-center gap-3 hover:bg-[#FAEDCD] transition"
          >
            View services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </a>

          <a
            href="tel:+21600000000"
            className="px-10 py-5 border border-white/20 text-white/70 uppercase tracking-[0.2em] text-sm flex items-center gap-3 hover:border-white/50 hover:text-white transition"
          >
            <Phone className="w-4 h-4" />
            Call now
          </a>
        </div>

        {/* Trust line */}
        <div className="mt-16 flex justify-center gap-6 text-white/30 text-xs uppercase tracking-widest">
          <span>Secure Payment</span>
          <span>•</span>
          <span>No Obligation</span>
          <span>•</span>
          <span>24/7 Support</span>
        </div>
      </div>
    </section>
  );
}