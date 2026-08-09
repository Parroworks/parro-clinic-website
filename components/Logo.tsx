"use client";

import { useId } from "react";

/* ── Brand tokens (mirrors globals.css) ─────────────────────────────── */
const B = {
  teal:    "#11C5B5",
  blue:    "#3B82F6",
  purple:  "#6D5EF7",
  navy:    "#0F1E5C",
  waGreen: "#25D366",
};

/* ── Symbol: kept for in-product UI (Dashboard mock) ─────────────────── */
function CliniqSymbol({
  size = 80,
  mono,
}: {
  size?: number;
  mono?: "white" | "black" | "navy";
}) {
  const raw = useId();
  const id  = "sym" + raw.replace(/\W/g, "");

  if (mono) {
    const fill = mono === "white" ? "#FFFFFF" : mono === "black" ? "#111111" : B.navy;
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
        <path d="M42.62,68.02 A22,22 0 1,1 42.62,31.98 L38.03,38.53 A14,14 0 1,0 38.03,61.47Z" fill={fill} />
        <path d="M57.38,31.98 A22,22 0 1,1 57.38,68.02 L61.97,61.47 A14,14 0 1,0 61.97,38.53Z" fill={fill} />
        <circle cx="41" cy="50" r="3" fill={fill} />
        <circle cx="50" cy="50" r="3" fill={fill} />
        <circle cx="59" cy="50" r="3" fill={fill} />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}-rc`} gradientUnits="userSpaceOnUse" x1="50" y1="28" x2="82" y2="72">
          <stop offset="0%"   stopColor={B.blue}   />
          <stop offset="100%" stopColor={B.purple}  />
        </linearGradient>
        <linearGradient id={`${id}-dot-mid`} gradientUnits="userSpaceOnUse" x1="45" y1="50" x2="55" y2="50">
          <stop offset="0%"   stopColor={B.teal}   />
          <stop offset="100%" stopColor={B.blue}   />
        </linearGradient>
      </defs>
      <path
        d="M42.62,68.02 A22,22 0 1,1 42.62,31.98 L38.03,38.53 A14,14 0 1,0 38.03,61.47Z"
        fill={B.teal}
      />
      <path
        d="M57.38,31.98 A22,22 0 1,1 57.38,68.02 L61.97,61.47 A14,14 0 1,0 61.97,38.53Z"
        fill={`url(#${id}-rc)`}
      />
      <circle cx="41" cy="50" r="3" fill={B.teal}   />
      <circle cx="50" cy="50" r="3" fill={`url(#${id}-dot-mid)`} />
      <circle cx="59" cy="50" r="3" fill={B.purple} />
    </svg>
  );
}

/* ── Public Logo component ───────────────────────────────────────────── */

export interface LogoProps {
  /** Size bucket — controls logo height */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Show on dark backgrounds (white wordmark) */
  dark?: boolean;
  /** Monochrome override — white uses the dark-bg asset */
  mono?: "white" | "black" | "navy";
  /** Hide tagline ("engage · retain · grow") */
  noTag?: boolean;
  /** Only the symbol, no wordmark */
  iconOnly?: boolean;
}

const HEIGHTS: Record<NonNullable<LogoProps["size"]>, number> = {
  xs: 28,
  sm: 40,
  md: 56,
  lg: 72,
  xl: 96,
};

function logoSrc({
  dark,
  mono,
  noTag,
}: {
  dark?: boolean;
  mono?: LogoProps["mono"];
  noTag?: boolean;
}) {
  const useWhite = Boolean(dark || mono === "white");
  if (noTag) {
    return useWhite ? "/parro-logo-notag-white.png" : "/parro-logo-notag.png";
  }
  return useWhite ? "/parro-logo-white.png" : "/parro-logo.png";
}

export default function Logo({
  size    = "md",
  dark    = false,
  mono,
  noTag   = false,
  iconOnly = false,
}: LogoProps) {
  const height = HEIGHTS[size];

  if (iconOnly) {
    return <CliniqSymbol size={height} mono={mono ?? (dark ? "white" : undefined)} />;
  }

  const src = logoSrc({ dark, mono, noTag });
  // Intrinsic aspect: full ~909×294, no-tag ~909×240
  const aspect = noTag ? 909 / 240 : 909 / 294;
  const width = Math.round(height * aspect);

  return (
    <img
      src={src}
      alt="parro connect logo - engage, retain, grow"
      width={width}
      height={height}
      style={{
        height,
        width: "auto",
        display: "block",
        objectFit: "contain",
      }}
    />
  );
}

/* Named re-exports for convenience */
export { CliniqSymbol };
