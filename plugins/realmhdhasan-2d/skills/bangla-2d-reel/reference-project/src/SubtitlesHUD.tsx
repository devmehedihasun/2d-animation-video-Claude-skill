import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "./theme";
import { clampOpts } from "./anim";

const C = theme.color;
const FAM = theme.font.bn; // Noto Serif Bengali — matches the reference boards

// ============================================================
// HUD — three layers, all on dark green plates with gold rules.
// TYPE RULE: crisp. Dark stroke via paint-order + a tight offset
// shadow. NEVER a gaussian glow on Bengali text — it smears the
// conjuncts. Accent word is GOLD, never red.
// ============================================================

export type Word = { t: string; accent?: boolean };

let _ctx: CanvasRenderingContext2D | null = null;
const measure = (t: string, size: number) => {
  if (typeof document === "undefined") return t.length * size * 0.62;
  if (!_ctx) _ctx = document.createElement("canvas").getContext("2d");
  if (!_ctx) return t.length * size * 0.62;
  _ctx.font = `700 ${size}px ${FAM}`;
  return _ctx.measureText(t).width;
};

/** word-by-word spring reveal, 3-frame stagger, never glyph-by-glyph */
export const Words: React.FC<{ line: Word[]; cx: number; cy: number; start: number; size?: number }> = ({
  line, cx, cy, start, size = 58,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const GAP = Math.round(size * 0.3);
  const w = line.map((x) => measure(x.t, size) + GAP);
  const total = w.reduce((a, b) => a + b, 0) - GAP;
  let x = cx - total / 2;

  return (
    <>
      {line.map((word, i) => {
        const p = spring({ frame: frame - start - i * 3, fps, config: theme.spring.pop, durationInFrames: 18 });
        const at = x + (w[i] - GAP) / 2;
        x += w[i];
        if (p <= 0.001) return null;
        return (
          <g key={i} opacity={p}
            transform={`translate(${at} ${cy + interpolate(p, [0, 1], [20, 0], clampOpts)}) scale(${interpolate(p, [0, 1], [0.86, 1], clampOpts)})`}>
            <text
              textAnchor="middle" fontFamily={FAM} fontWeight={700} fontSize={size}
              fill={word.accent ? C.gold : C.cream}
              stroke={C.inkDark} strokeWidth={7} strokeLinejoin="round"
              paintOrder="stroke"
              filter={`url(#${word.accent ? "f-txtgold" : "f-txt"})`}
              letterSpacing={0}
            >
              {word.t}
            </text>
          </g>
        );
      })}
    </>
  );
};

const Plate: React.FC<{ w: number; h: number; rx?: number; children?: React.ReactNode }> = ({ w, h, rx = 26, children }) => (
  <>
    <g filter="url(#f-panel)">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={rx} fill="url(#g-panel)" stroke={C.goldDeep} strokeWidth={2.5} />
    </g>
    <rect x={-w / 2 + 16} y={-h / 2 + 14} width={w - 32} height={h - 28} rx={rx - 8} fill="none" stroke={C.gold} strokeWidth={1.3} opacity={0.42} />
    {children}
  </>
);

export const BrandPill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: theme.spring.gentle, durationInFrames: 20 });
  return (
    <g opacity={p} transform={`translate(540 ${92 + interpolate(p, [0, 1], [-44, 0], clampOpts)})`}>
      <Plate w={424} h={72} rx={36} />
      <text x={0} y={13} textAnchor="middle" fontFamily={theme.font.latinSerif} fontStyle="italic" fontSize={40} fill={C.gold}>
        {theme.brand}
      </text>
    </g>
  );
};

export const ContextPill: React.FC<{ label: string; delay?: number }> = ({ label, delay = 7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.gentle, durationInFrames: 20 });
  return (
    <g opacity={p} transform={`translate(540 ${190 + interpolate(p, [0, 1], [-30, 0], clampOpts)})`}>
      <Plate w={300} h={58} rx={29} />
      <circle cx={-112} cy={0} r={8.5} fill={C.gold} />
      <text x={10} y={12} textAnchor="middle" fontFamily={FAM} fontWeight={700} fontSize={33} fill={C.cream}>{label}</text>
    </g>
  );
};

/**
 * Subtitle panel. CENTRE sits at theme.layout.subtitleCY (1548) — raised well
 * off the bottom edge. The plate GROWS when a second line arrives so it is
 * never a half-empty box.
 */
export const SubtitlePanel: React.FC<{ line1: Word[]; line2?: Word[]; start1?: number; start2?: number }> = ({
  line1, line2, start1 = 20, start2 = 98,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const CY = theme.layout.subtitleCY;
  const pIn = spring({ frame: frame - start1 + 6, fps, config: theme.spring.soft, durationInFrames: 22 });
  const grow = line2 ? spring({ frame: frame - (start2 - 4), fps, config: theme.spring.gentle, durationInFrames: 20 }) : 0;
  const PH = interpolate(grow, [0, 1], [150, 232], clampOpts);
  const y1 = CY + interpolate(grow, [0, 1], [18, -30], clampOpts);

  return (
    <>
      <g opacity={pIn} transform={`translate(540 ${CY + interpolate(pIn, [0, 1], [40, 0], clampOpts)})`}>
        <Plate w={984} h={PH} />
        <rect x={-300} y={-PH / 2} width={600} height={3} fill="url(#g-goldbar)" opacity={0.9} />
      </g>
      <Words line={line1} cx={540} cy={y1} start={start1 + 6} />
      {line2 && <Words line={line2} cx={540} cy={CY + 58} start={start2} />}
    </>
  );
};

/** Pinned stat card — the HIT. Red push-pin, gold count-up, overshoot + micro shake. */
export const PinnedStat: React.FC<{
  label: string; value: number; x?: number; y?: number; start?: number; countFor?: number;
}> = ({ label, value, x = 862, y = 352, start = 84, countFor = 38 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - start, fps, config: theme.spring.stampy, durationInFrames: 20 });
  if (p <= 0.001) return null;
  const n = Math.round(interpolate(frame, [start + 4, start + 4 + countFor], [0, value], { ...clampOpts, easing: theme.ease.out }));
  const shake = frame > start && frame < start + 10 ? Math.sin((frame - start) * 2.2) * 1.6 : 0;
  return (
    <g opacity={p}
      transform={`translate(${x} ${y + interpolate(p, [0, 1], [-26, 0], clampOpts)}) rotate(${-5 + shake}) scale(${interpolate(p, [0, 1], [1.25, 1], clampOpts)})`}>
      <Plate w={268} h={156} rx={18} />
      <text x={0} y={-22} textAnchor="middle" fontFamily={FAM} fontWeight={700} fontSize={27} fill={C.cream} opacity={0.85}>{label}</text>
      <text x={0} y={40} textAnchor="middle" fontFamily={FAM} fontWeight={700} fontSize={74} fill={C.gold}
        stroke={C.inkDark} strokeWidth={6} paintOrder="stroke" filter="url(#f-txtgold)"
        style={{ fontVariantNumeric: "tabular-nums" }}>
        {bnNum(groupIN(n))}
      </text>
      <circle cx={0} cy={-74} r={11} fill={C.stampRed} stroke={C.inkDark} strokeWidth={2.5} />
    </g>
  );
};

/** ০১২৩৪৫৬৭৮৯ */
export const bnNum = (n: number | string) => String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
/** Indian grouping: 1,00,000 */
export const groupIN = (n: number) => {
  const s = String(n);
  if (s.length <= 3) return s;
  let head = s.slice(0, -3);
  const tail = s.slice(-3);
  const out: string[] = [];
  while (head.length > 2) { out.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) out.unshift(head);
  return out.join(",") + "," + tail;
};

export const HUDRoot: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${theme.layout.W} ${theme.layout.H}`} style={{ position: "absolute", inset: 0 }}>
      {children}
    </svg>
  </AbsoluteFill>
);
