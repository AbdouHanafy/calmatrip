import React from "react";

interface CalmaLogoMarkProps {
  width?: number;
  height?: number;
  tone?: "cream" | "white" | "olive";
  className?: string;
}

const TONE_COLOR: Record<NonNullable<CalmaLogoMarkProps["tone"]>, string> = {
  cream: "#F0E2CE",
  white: "#FFFFFF",
  olive: "#4C7A92",
};

export default function CalmaLogoMark({
  width = 40,
  height = 33,
  tone = "cream",
  className,
}: CalmaLogoMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-block",
        width,
        height,
        backgroundColor: TONE_COLOR[tone],
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
  );
}
