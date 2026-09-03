import React from "react";

interface CalmaPageHeroProps {
  kicker: string;
  title: string;
  subtitle: string;
}

export default function CalmaPageHero({ kicker, title, subtitle }: CalmaPageHeroProps) {
  return (
    <section
      className="relative overflow-hidden px-6 pb-[84px] pt-14 text-center font-hanken sm:px-10"
      style={{ backgroundColor: "#4C7A92" }}
    >
      <div
        className="absolute left-1/2 top-[8%] h-[78px] w-[78px] -translate-x-1/2 rounded-full motion-safe:animate-[calma-sunpulse_6s_ease-in-out_infinite]"
        style={{ backgroundColor: "#D2B38B" }}
      />
      <div
        className="absolute -bottom-[4%] -left-[15%] -right-[15%] h-[46%] bg-calma-olive-deep"
        style={{ borderRadius: "58% 62% 0 0/92% 88% 0 0" }}
      />
      <div
        className="absolute -bottom-[8%] -left-[18%] -right-[8%] h-[36%] bg-calma-olive-deeper"
        style={{ borderRadius: "52% 60% 0 0/88% 90% 0 0" }}
      />
      <div className="absolute bottom-[30%] left-[16%] flex items-end gap-[7px] opacity-[.42]">
        <div className="h-14 w-[26px] rounded-t-[13px] bg-[#242719]" />
        <div className="h-[84px] w-[34px] rounded-t-[17px] bg-[#242719]" />
        <div className="h-[46px] w-[22px] rounded-t-[11px] bg-[#242719]" />
      </div>

      <div className="relative z-[2] mx-auto max-w-[640px]">
        <div className="mb-3.5 text-[11.5px] font-bold uppercase tracking-[.18em] text-calma-terracotta-soft">
          {kicker}
        </div>
        <h1 className="mb-3.5 text-balance font-fraunces text-[clamp(34px,5vw,58px)] font-normal leading-[1.02] tracking-[-0.02em] text-calma-cream">
          {title}
        </h1>
        <p className="mx-auto max-w-[520px] text-[16.5px] leading-[1.55] text-calma-cream/[.82]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
