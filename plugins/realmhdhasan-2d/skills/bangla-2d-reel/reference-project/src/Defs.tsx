import React from "react";
import { theme, shade, tint } from "./theme";

const C = theme.color;
const S = theme.shade;
const L = theme.light;

export type CharConfig = {
  skin: string;
  hair: string;
  outfit: string;
  lower: string;
  hairStyle: "short" | "balding" | "bun";
  mustache?: boolean;
  glasses?: boolean;
  earring?: boolean;
  pocket?: boolean;
  shoe: string;
};

/** id of the gradient for one body part of one character */
export const gid = (name: string, part: "skin" | "cloth" | "lower" | "hair") =>
  `g-${name}-${part}`;

/**
 * PREMIUM FILL — four stops from ONE base hex.
 * lit (warm-tinted) -> base -> base (hold) -> shade.
 * The hold stop at 64% is what keeps it reading as deliberate cel shading
 * instead of a muddy airbrush. Never replace this with a 2-stop gradient.
 */
const Grad: React.FC<{ id: string; base: string; mul: number }> = ({ id, base, mul }) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="0.3">
    <stop offset="0%" stopColor={tint(shade(base, 1.06), C.warm, S.lightTint)} />
    <stop offset="36%" stopColor={base} />
    <stop offset={`${S.holdStop * 100}%`} stopColor={base} />
    <stop offset="100%" stopColor={shade(base, mul)} />
  </linearGradient>
);

/**
 * Drop this ONCE at the top of the composition. Every character, panel and
 * light in the project pulls from these defs.
 */
export const PremiumDefs: React.FC<{ cast: Record<string, CharConfig> }> = ({ cast }) => (
  <defs>
    {(Object.entries(cast) as Array<[string, CharConfig]>).flatMap(([n, c]) => [
      <Grad key={`${n}s`} id={gid(n, "skin")} base={c.skin} mul={S.skinMul} />,
      <Grad key={`${n}c`} id={gid(n, "cloth")} base={c.outfit} mul={S.clothMul} />,
      <Grad key={`${n}l`} id={gid(n, "lower")} base={c.lower} mul={S.clothMul} />,
      <Grad key={`${n}h`} id={gid(n, "hair")} base={c.hair} mul={S.hairMul} />,
    ])}

    <linearGradient id="g-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.wallLo} />
      <stop offset="44%" stopColor={C.wall} />
      <stop offset="100%" stopColor={C.wallHi} />
    </linearGradient>
    <linearGradient id="g-floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.floorLo} />
      <stop offset="100%" stopColor={C.floor} />
    </linearGradient>
    <linearGradient id="g-panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.panelHi} />
      <stop offset="100%" stopColor={C.panelLo} />
    </linearGradient>
    <linearGradient id="g-goldbar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor={C.goldDeep} stopOpacity={0} />
      <stop offset="50%" stopColor={C.gold} />
      <stop offset="100%" stopColor={C.goldDeep} stopOpacity={0} />
    </linearGradient>

    <radialGradient id="g-bloom" cx="0.5" cy="0.3" r="0.66">
      <stop offset="0%" stopColor="#FFE2B0" stopOpacity={L.bloomOpacity} />
      <stop offset="55%" stopColor={C.warm} stopOpacity={0.08} />
      <stop offset="100%" stopColor={C.warm} stopOpacity={0} />
    </radialGradient>
    <radialGradient id="g-vig" cx="0.5" cy="0.44" r="0.76">
      <stop offset="52%" stopColor="#1A1109" stopOpacity={0} />
      <stop offset="100%" stopColor="#1A1109" stopOpacity={L.vignetteOpacity} />
    </radialGradient>
    <radialGradient id="g-pool">
      <stop offset="0%" stopColor="#2A1A10" stopOpacity={0.36} />
      <stop offset="68%" stopColor="#2A1A10" stopOpacity={0.11} />
      <stop offset="100%" stopColor="#2A1A10" stopOpacity={0} />
    </radialGradient>

    {/* blur whole GROUPS only — never per shape, or renders crawl */}
    <filter id="f-soft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation={10} />
    </filter>
    <filter id="f-dof" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation={L.dofBlur} />
    </filter>
    <filter id="f-dof2" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation={L.dofBlurNear} />
    </filter>

    {/* card lift */}
    <filter id="f-panel" x="-20%" y="-20%" width="140%" height="170%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#160D06" floodOpacity="0.45" />
    </filter>

    {/* TYPE: crisp. A tight offset shadow, NOT a glow. Never blur the text. */}
    <filter id="f-txt" x="-20%" y="-30%" width="140%" height="180%">
      <feDropShadow dx="2" dy="4" stdDeviation="1.2" floodColor="#0A1812" floodOpacity="0.95" />
    </filter>
    {/* accent word: same crisp shadow + a 3px warm sheen, nothing more */}
    <filter id="f-txtgold" x="-30%" y="-40%" width="160%" height="200%">
      <feDropShadow dx="2" dy="4" stdDeviation="1.2" floodColor="#0A1812" floodOpacity="0.95" result="s" />
      <feDropShadow in="s" dx="0" dy="0" stdDeviation="3" floodColor="#FFC95E" floodOpacity="0.45" />
    </filter>
  </defs>
);
