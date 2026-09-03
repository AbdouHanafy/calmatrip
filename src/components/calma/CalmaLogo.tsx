"use client";
import Image from "next/image";

// Real Calma Trip brand mark — extracted from the Charte Graphique (destination
// pin + Tunisian profile). The wordmark is set in Raleway (the site's UI font)
// rather than baked into a raster, so it stays crisp at any size and recolors
// cleanly for both light and dark contexts via CSS masking on the icon.
const TONE = {
  cream: "#F0E2CE",
  navy: "#15242E",
} as const;

export interface CalmaLogoProps {
  /** "cream" for dark/photo backgrounds (header overlay, footer). "navy" for light surfaces. */
  tone?: keyof typeof TONE;
  /** Show the "Your Tunisian Escape" tagline beneath the wordmark. */
  tagline?: boolean;
  className?: string;
  iconSize?: number;
}

export default function CalmaLogo({
  tone = "cream",
  tagline = false,
  className = "",
  iconSize = 34,
}: CalmaLogoProps) {
  const color = TONE[tone];
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          flexShrink: 0,
          width: iconSize,
          height: iconSize * 0.98,
          backgroundColor: color,
          WebkitMaskImage: "url(/images/brand/logo-mark.png)",
          maskImage: "url(/images/brand/logo-mark.png)",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      />
      <span className="flex flex-col leading-none">
        <span className="font-hanken text-[22px] leading-none" style={{ color }}>
          <span className="font-bold">Calma</span> <span className="font-light">Trip</span>
        </span>
        {tagline && (
          <span
            className="mt-1 font-fraunces text-[11px] italic leading-none opacity-80"
            style={{ color }}
          >
            Your Tunisian Escape
          </span>
        )}
      </span>
    </span>
  );
}

/** Renders the admin-uploaded logo image when Site Settings has one, otherwise
 * the real brand mark above — so Media Library overrides keep working.
 * `imgClassName` sizes the raster fallback (an <Image>); `iconSize` sizes the
 * code-rendered mark, since it doesn't scale via height utility classes. */
export function CalmaLogoOrCustom({
  customUrl,
  alt,
  tone = "cream",
  imgClassName = "h-8 w-auto",
  iconSize = 30,
}: {
  customUrl?: string | null;
  alt: string;
  tone?: keyof typeof TONE;
  imgClassName?: string;
  iconSize?: number;
}) {
  if (customUrl) {
    return <Image src={customUrl} alt={alt} width={252} height={78} className={imgClassName} />;
  }
  return <CalmaLogo tone={tone} iconSize={iconSize} />;
}
