/**
 * Decorative SVG illustrations for /get-started. Pure SVG (no images to download), coloured from the
 * site's CSS variables so they follow the brand. All are aria-hidden: they carry no information.
 */

const common = {
  "aria-hidden": true,
  focusable: false,
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-auto w-full",
} as const;

const C = {
  teal: "var(--teal)",
  tealDark: "var(--teal-dark)",
  tealLight: "var(--teal-light)",
  wa: "var(--wa-green)",
  navy: "var(--navy)",
  border: "var(--border)",
  amber: "var(--amber)",
};

/** Step 1 — the clinic, with an appointment card and a WhatsApp message floating around it. */
export function ClinicIllustration() {
  return (
    <svg viewBox="0 0 480 360" {...common}>
      <circle cx="240" cy="190" r="150" fill={C.tealLight} />
      <circle cx="96" cy="270" r="34" fill="#fff" opacity=".55" />
      <circle cx="404" cy="94" r="22" fill="#fff" opacity=".6" />

      {/* ground */}
      <ellipse cx="240" cy="296" rx="150" ry="11" fill={C.teal} opacity=".18" />

      {/* building */}
      <rect x="148" y="156" width="184" height="140" rx="10" fill="#fff" stroke={C.border} strokeWidth="2" />
      <path d="M134 162 L240 100 L346 162 Z" fill={C.teal} />
      <circle cx="240" cy="134" r="17" fill="#fff" />
      <rect x="236" y="124" width="8" height="20" rx="2" fill={C.teal} />
      <rect x="230" y="130" width="20" height="8" rx="2" fill={C.teal} />
      <rect x="221" y="226" width="38" height="70" rx="6" fill={C.tealDark} />
      <circle cx="251" cy="262" r="2.5" fill="#fff" />
      <rect x="166" y="188" width="42" height="38" rx="6" fill={C.tealLight} stroke={C.border} />
      <rect x="272" y="188" width="42" height="38" rx="6" fill={C.tealLight} stroke={C.border} />
      <path d="M187 188 v38 M166 207 h42 M293 188 v38 M272 207 h42" stroke="#fff" strokeWidth="2" />

      {/* plants */}
      <rect x="118" y="270" width="16" height="26" rx="3" fill={C.tealDark} />
      <circle cx="126" cy="262" r="14" fill={C.teal} />
      <circle cx="138" cy="270" r="9" fill={C.wa} />
      <rect x="348" y="274" width="14" height="22" rx="3" fill={C.tealDark} />
      <circle cx="355" cy="266" r="12" fill={C.teal} />

      {/* appointment card */}
      <g transform="translate(40 78)">
        <rect width="124" height="78" rx="14" fill="#fff" stroke={C.border} strokeWidth="2" />
        <rect x="14" y="14" width="34" height="10" rx="5" fill={C.teal} />
        <rect x="14" y="34" width="78" height="8" rx="4" fill={C.border} />
        <rect x="14" y="50" width="56" height="8" rx="4" fill={C.border} />
        <circle cx="98" cy="54" r="13" fill={C.tealLight} />
        <path d="M91 54 l5 5 l10 -11" fill="none" stroke={C.teal} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* WhatsApp-style message */}
      <g transform="translate(318 56)">
        <rect width="124" height="58" rx="16" fill={C.wa} />
        <path d="M22 58 l-6 14 l20 -14 Z" fill={C.wa} />
        <rect x="16" y="16" width="78" height="8" rx="4" fill="#fff" opacity=".95" />
        <rect x="16" y="32" width="52" height="8" rx="4" fill="#fff" opacity=".7" />
      </g>

      <circle cx="58" cy="206" r="6" fill={C.amber} className="motion-safe:animate-pulse" />
      <circle cx="430" cy="196" r="5" fill={C.teal} className="motion-safe:animate-pulse" />
    </svg>
  );
}

/** Step 2 — clinic ⇄ patient's phone, connected over WhatsApp. */
export function ConnectIllustration() {
  return (
    <svg viewBox="0 0 480 360" {...common}>
      <circle cx="240" cy="190" r="150" fill={C.tealLight} />

      {/* connection lines */}
      <path d="M92 196 C 130 196 140 196 176 196" stroke={C.teal} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" fill="none" />
      <path d="M304 196 C 340 196 350 196 388 196" stroke={C.teal} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" fill="none" />

      {/* clinic node */}
      <circle cx="68" cy="196" r="34" fill="#fff" stroke={C.border} strokeWidth="2" />
      <path d="M54 206 v-18 l14 -10 l14 10 v18 Z" fill={C.teal} />
      <rect x="64" y="190" width="8" height="16" rx="1.5" fill="#fff" />

      {/* verified node */}
      <circle cx="412" cy="196" r="34" fill="#fff" stroke={C.border} strokeWidth="2" />
      <path d="M412 178 l16 6 v10 c0 11 -7 19 -16 23 c-9 -4 -16 -12 -16 -23 v-10 Z" fill={C.teal} />
      <path d="M404 196 l6 6 l10 -12" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* phone */}
      <rect x="176" y="40" width="128" height="262" rx="26" fill={C.navy} />
      <rect x="185" y="58" width="110" height="226" rx="16" fill="#fff" />
      <rect x="185" y="58" width="110" height="34" rx="16" fill={C.tealDark} />
      <rect x="185" y="76" width="110" height="16" fill={C.tealDark} />
      <circle cx="203" cy="75" r="9" fill="#fff" opacity=".9" />
      <rect x="218" y="68" width="52" height="7" rx="3.5" fill="#fff" />
      <rect x="218" y="80" width="32" height="5" rx="2.5" fill="#fff" opacity=".6" />
      <rect x="226" y="46" width="28" height="5" rx="2.5" fill="#0b0b1c" opacity=".6" />

      {/* chat */}
      <rect x="185" y="92" width="110" height="192" fill={C.tealLight} opacity=".55" />
      <rect x="195" y="106" width="68" height="26" rx="10" fill="#fff" />
      <rect x="205" y="115" width="46" height="6" rx="3" fill={C.border} />
      <rect x="222" y="142" width="64" height="26" rx="10" fill="#DCF8C6" />
      <rect x="232" y="151" width="42" height="6" rx="3" fill={C.wa} opacity=".7" />
      <rect x="195" y="178" width="76" height="40" rx="10" fill="#fff" />
      <rect x="205" y="188" width="54" height="6" rx="3" fill={C.border} />
      <rect x="205" y="200" width="36" height="6" rx="3" fill={C.border} />
      <rect x="222" y="228" width="64" height="26" rx="10" fill="#DCF8C6" />
      <rect x="232" y="237" width="40" height="6" rx="3" fill={C.wa} opacity=".7" />

      <circle cx="136" cy="110" r="6" fill={C.amber} className="motion-safe:animate-pulse" />
      <circle cx="350" cy="276" r="7" fill={C.wa} className="motion-safe:animate-pulse" />
    </svg>
  );
}

/** Step 3 — success: big check with confetti. */
export function DoneIllustration() {
  return (
    <svg viewBox="0 0 480 360" {...common}>
      <circle cx="240" cy="184" r="150" fill={C.tealLight} />
      <circle cx="240" cy="184" r="104" fill="#fff" opacity=".75" />
      <circle cx="240" cy="184" r="72" fill={C.teal} />
      <path d="M206 186 l24 24 l46 -52" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />

      {/* confetti */}
      <rect x="86" y="96" width="16" height="16" rx="3" fill={C.amber} transform="rotate(20 94 104)" />
      <rect x="372" y="84" width="14" height="14" rx="3" fill={C.wa} transform="rotate(-18 379 91)" />
      <circle cx="118" cy="252" r="9" fill={C.wa} />
      <circle cx="378" cy="262" r="8" fill={C.amber} />
      <path d="M150 70 l8 14 l-16 0 Z" fill={C.teal} />
      <path d="M338 300 l9 15 l-18 0 Z" fill={C.tealDark} />
      <rect x="60" y="178" width="22" height="7" rx="3.5" fill={C.teal} transform="rotate(-30 71 181)" />
      <rect x="400" y="170" width="22" height="7" rx="3.5" fill={C.amber} transform="rotate(35 411 173)" />
      <circle cx="206" cy="62" r="5" fill={C.tealDark} className="motion-safe:animate-pulse" />
      <circle cx="290" cy="316" r="5" fill={C.teal} className="motion-safe:animate-pulse" />
    </svg>
  );
}
