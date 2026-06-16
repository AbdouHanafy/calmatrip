import type { CSSProperties } from "react";
export function ZelligePattern({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="zellige"
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
      <rect width="100%" height="100%" fill="url(#zellige)" />
    </svg>
  );
}