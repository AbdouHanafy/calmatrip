export function ZelligePattern({ id, opacity = 0.06 }: { id: string; opacity?: number }) {
  return (
    <svg className="absolute inset-0 h-full w-full" style={{ opacity }} aria-hidden="true">
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path
            d="M28 2 L34 22 L54 28 L34 34 L28 54 L22 34 L2 28 L22 22 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          <circle cx="28" cy="28" r="4" fill="none" stroke="#ffffff" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
