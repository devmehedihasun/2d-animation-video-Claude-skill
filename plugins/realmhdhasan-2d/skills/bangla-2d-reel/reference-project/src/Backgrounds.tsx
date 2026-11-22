import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "./theme";

const C = theme.color;
const L = theme.light;

// ============================================================
// Stage. FIVE layers, always in this order:
// 1 base (wall gradient + wainscot + perspective floor)  — SHARP
// 2 props group                                          — DOF BLURRED
// 3 scene light (key bloom + light shaft)
// 4 characters  (caller supplies)
// 5 vignette + sparkles + grain
//
// Blur GROUPS, never individual shapes — that is what keeps renders fast.
// ============================================================

/** 1 — sharp ground plane. Never blur this; it runs toward camera. */
export const RoomBase: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1250} fill="url(#g-wall)" />
    <rect x={0} y={1162} width={1080} height={90} fill={C.wainscot} />
    <rect x={0} y={1238} width={1080} height={18} fill={C.skirt} />
    <rect x={0} y={1252} width={1080} height={668} fill="url(#g-floor)" />
    {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M ${540 + i * 134} 1256 L ${540 + i * 440} 1920`} stroke={C.floorLine} strokeWidth={3} opacity={0.42} fill="none" />
    ))}
    {[1, 2, 3].map((i) => (
      <path key={i} d={`M 0 ${1256 + i * i * 54} L 1080 ${1256 + i * i * 54}`} stroke={C.floorLine} strokeWidth={2.5} opacity={0.28} />
    ))}
  </g>
);

/** 2 — wrap every wall prop in this. ≥5 props per room or the scene reads empty. */
export const DepthLayer: React.FC<{ children: React.ReactNode; near?: boolean }> = ({ children, near }) => (
  <g filter={`url(#${near ? "f-dof2" : "f-dof"})`}>{children}</g>
);

/** 3 — ONE light source per scene. More than one and nothing reads as the hero. */
export const SceneLight: React.FC<{ preset?: "warmRoom" | "coolNight"; shaft?: boolean }> = ({
  preset = "warmRoom", shaft = true,
}) => {
  const k: { x: number; y: number; r: number; color: string; intensity: number } =
    preset === "coolNight" ? L.coolNight : L.warmRoom;
  return (
    <g>
      <ellipse cx={k.x} cy={k.y} rx={k.r} ry={k.r * 0.88} fill={k.color} opacity={k.intensity} filter="url(#f-soft)" />
      {shaft && <path d="M 690 0 L 1010 0 L 760 1250 L 320 1250 Z" fill="#FFE2B0" opacity={0.11} filter="url(#f-soft)" />}
      <rect x={0} y={0} width={1080} height={1920} fill="url(#g-bloom)" />
    </g>
  );
};

/** warm pool the characters stand in — sells the contact with the floor */
export const FloorGlow: React.FC<{ cx?: number; cy?: number; rx?: number }> = ({ cx = 540, cy = 1448, rx = 330 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.23} fill={C.warm} opacity={0.15} filter="url(#f-soft)" />
);

export const Vignette: React.FC = () => <rect x={0} y={0} width={1080} height={1920} fill="url(#g-vig)" />;

/** 5 — drifting motes. Keep them off the characters and off the type. */
export const Sparkles: React.FC<{ points?: Array<[number, number, number]> }> = ({
  points = [[196, 470, 0], [930, 560, 40], [560, 286, 20], [120, 760, 60], [1000, 900, 95]],
}) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {points.map(([x, y, o], i) => {
        const a = 0.2 + 0.3 * Math.max(0, Math.sin((frame + o) / 28));
        const r = 5 + 3 * Math.sin((frame + o) / 19);
        return (
          <g key={i} transform={`translate(${x} ${y})`} opacity={a}>
            <path
              d={`M 0 ${-r * 2.4} Q ${r * 0.38} ${-r * 0.38} ${r * 2.4} 0 Q ${r * 0.38} ${r * 0.38} 0 ${r * 2.4} Q ${-r * 0.38} ${r * 0.38} ${-r * 2.4} 0 Q ${-r * 0.38} ${-r * 0.38} 0 ${-r * 2.4} Z`}
              fill="#FFE9BF"
            />
          </g>
        );
      })}
    </g>
  );
};

/** top-most film grain, DOM layer so it never costs an SVG filter */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.05 }}>
    <AbsoluteFill
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")",
        backgroundSize: "360px 360px",
      }}
    />
  </AbsoluteFill>
);

// ---------------- an example furnished room (≥5 props) ----------------
export const LivingRoomProps: React.FC = () => {
  const frame = useCurrentFrame();
  const OUT = C.outline;
  return (
    <g>
      {/* window */}
      <g>
        <rect x={78} y={430} width={286} height={330} rx={8} fill="#BFD8E2" stroke={OUT} strokeWidth={7} />
        <rect x={78} y={430} width={286} height={126} fill="#9EC3D4" opacity={0.85} />
        {[1, 2, 3, 4].map((i) => <path key={i} d={`M ${78 + i * 57} 430 L ${78 + i * 57} 760`} stroke={OUT} strokeWidth={5} />)}
        <path d="M 78 596 L 364 596" stroke={OUT} strokeWidth={5} />
        <rect x={44} y={422} width={40} height={346} rx={6} fill="#3F7A5E" stroke={OUT} strokeWidth={6} />
        <rect x={358} y={422} width={40} height={346} rx={6} fill="#3F7A5E" stroke={OUT} strokeWidth={6} />
        <rect x={38} y={756} width={368} height={20} rx={6} fill={C.wainscot} stroke={OUT} strokeWidth={5} />
      </g>
      {/* wall clock — hands move, cheap life */}
      <g transform="translate(540 392)">
        <circle r={54} fill="#F7EFE1" stroke={OUT} strokeWidth={7} />
        <path d="M 0 0 L 0 -32" stroke={OUT} strokeWidth={6} strokeLinecap="round" transform={`rotate(${frame * 0.8})`} />
        <path d="M 0 0 L 22 10" stroke={C.goldDeep} strokeWidth={5} strokeLinecap="round" transform={`rotate(${frame * 0.26})`} />
        <circle r={5} fill={OUT} />
      </g>
      {/* framed picture */}
      <g transform="translate(846 440)">
        <rect x={-94} y={-76} width={188} height={152} rx={6} fill="#8A5A34" stroke={OUT} strokeWidth={7} />
        <rect x={-76} y={-58} width={152} height={116} fill="#F3E9D6" />
        <path d="M -60 42 L -16 -10 L 12 24 L 42 -14 L 60 42 Z" fill="#4E7F63" />
        <circle cx={34} cy={-28} r={12} fill={C.gold} />
      </g>
      {/* shelf + books + plant */}
      <g transform="translate(214 1010)">
        <rect x={-118} y={0} width={236} height={18} rx={5} fill={C.wainscot} stroke={OUT} strokeWidth={6} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={-102 + i * 33} y={-60 - (i % 2) * 10} width={25} height={60 + (i % 2) * 10} rx={3}
            fill={["#9C3A2A", "#2C6E72", "#C79A47", "#4E7F63"][i]} stroke={OUT} strokeWidth={5} />
        ))}
        <g transform="translate(64 -10)">
          <path d="M -25 0 L -19 -52 L 19 -52 L 25 0 Z" fill="#B9663C" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          <path d="M 0 -52 C -28 -74 -32 -110 -6 -124" fill="none" stroke="#3F7A5E" strokeWidth={9} strokeLinecap="round" />
          <path d="M 0 -52 C 24 -80 22 -106 2 -120" fill="none" stroke="#4E8F6E" strokeWidth={9} strokeLinecap="round" />
          <ellipse cx={-15} cy={-118} rx={17} ry={10} fill="#4E8F6E" stroke={OUT} strokeWidth={4} transform="rotate(-22 -15 -118)" />
          <ellipse cx={11} cy={-114} rx={17} ry={10} fill="#3F7A5E" stroke={OUT} strokeWidth={4} transform="rotate(20 11 -114)" />
        </g>
      </g>
      {/* hanging lamp */}
      <g transform="translate(996 0)">
        <path d="M 0 0 L 0 206" stroke={OUT} strokeWidth={5} />
        <path d="M -36 206 L 36 206 L 19 252 L -19 252 Z" fill="#B9663C" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
        <circle cy={266} r={15} fill="#FFE2A8" stroke={OUT} strokeWidth={4} />
      </g>
    </g>
  );
};
