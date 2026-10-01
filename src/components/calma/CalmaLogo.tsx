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
  /** Height of the pin in px. */
  iconSize?: number;
  /** Wordmark font size in px. */
  textSize?: number;
}

// logo-mark-trim.png is logo-mark.png with its transparent side margins cropped
// (705×406 canvas → 280×383 pin), so iconSize is the pin's real height.
const MARK_RATIO = 280 / 383;

export default function CalmaLogo({
  tone = "cream",
  tagline = false,
  className = "",
  iconSize = 34,
  textSize = 20,
}: CalmaLogoProps) {
  const color = TONE[tone];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          flexShrink: 0,
          width: Math.round(iconSize * MARK_RATIO),
          height: iconSize,
          backgroundColor: color,
          WebkitMaskImage: "url(/images/brand/logo-mark-trim.png)",
          maskImage: "url(/images/brand/logo-mark-trim.png)",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      />
      <span className="flex flex-col leading-none">
        <span
          className="whitespace-nowrap font-hanken leading-none tracking-[-0.01em]"
          style={{ color, fontSize: textSize }}
        >
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
  textSize,
}: {
  customUrl?: string | null;
  alt: string;
  tone?: keyof typeof TONE;
  imgClassName?: string;
  iconSize?: number;
  textSize?: number;
}) {
  if (customUrl) {
    // Intrinsic size must match the uploaded asset's real aspect ratio — Next/Image uses
    // width/height to derive the box's aspect-ratio CSS, and a mismatch here stretches the
    // rendered logo non-uniformly even though imgClassName only constrains one dimension.
    return <Image src={customUrl} alt={alt} width={2036} height={586} className={imgClassName} />;
  }
  return <CalmaLogo tone={tone} iconSize={iconSize} textSize={textSize} />;
}
