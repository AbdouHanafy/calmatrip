import React from 'react';

export interface CalmaIconProps {
  size?: number;
  className?: string;
  stroke?: string;
}

function base(path: React.ReactNode) {
  return function Icon({ size = 26, className, stroke = '#F8F5F0' }: CalmaIconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        {path}
      </svg>
    );
  };
}

/** Culture — temple */
export const IconTemple = base(<path d="M3 9h18M4 9l8-5 8 5M6 9v9M10 9v9M14 9v9M18 9v9M3 21h18" />);

/** Médina — arch */
export const IconArch = base(<path d="M5 21V10a7 7 0 0 1 14 0v11M5 21h14M12 21v-6" />);

/** Plage — parasol */
export const IconParasol = base(<path d="M12 3v18M4 12a8 8 0 0 1 16 0Z" />);

/** Désert — sun over dune */
export const IconDuneSun = base(
  <>
    <circle cx="17" cy="7" r="3" />
    <path d="M2 18c3-4 6-1 9-3s6-3 11 1" />
  </>
);

/** Food — bowl */
export const IconBowl = base(<path d="M3 11h18a9 9 0 0 1-18 0ZM7 11c0-3 2-5 5-5" />);

/** Hammam — drop */
export const IconDrop = base(<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" />);

/** Voile — sailboat */
export const IconSailboat = base(<path d="M12 3v13M12 4l7 12H5zM4 19h16l-2 2H6z" />);

/** Aventure — compass */
export const IconAdventure = base(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M15 9l-2 5-4 1 2-5z" />
  </>
);
