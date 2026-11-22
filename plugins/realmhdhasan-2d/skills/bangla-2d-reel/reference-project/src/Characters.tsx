import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "./theme";
import { gid } from "./Defs";
import type { CharConfig } from "./Defs";
import { blink, mouth as mouthAmt, breathe } from "./anim";

const C = theme.color;
const S = theme.shade;
const OUT = C.outline;
const SW = 5;   // body outline
const FW = 4;   // facial feature

// ============================================================
// FRONT-FACING character rig — every character looks into camera.
// (0,0) = ground between the feet. Figure ~565 units tall, ~4.3 heads.
// viewBox guidance: "-150 -600 300 620"
// NEVER draw a profile/side head in this project.
// ============================================================

export type Expr = "neutral" | "happy" | "sad" | "worried" | "angry";
export type ArmPose = "down" | "clasp" | "raise";

export const PRESET: Record<string, CharConfig> = {
  father: {
    skin: "#A8703F", hair: "#AFA9A1", outfit: "#F2EEE4", lower: "#6E717A",
    hairStyle: "balding", mustache: true, glasses: true, pocket: true, shoe: "#3A2E26",
  },
  son: {
    skin: "#B87D4F", hair: "#1C1512", outfit: "#DFAA39", lower: "#3F5A86",
    hairStyle: "short", pocket: true, shoe: "#F0EAE0",
  },
  mother: {
    skin: "#A8703F", hair: "#2A211C", outfit: "#2C7778", lower: "#2C7778",
    hairStyle: "bun", earring: true, shoe: "#5A4030",
  },
};

const HEAD_Y = -500;
/** head silhouette: soft egg, flat-ish crown, rounded chin. ±52 wide, -71..61 tall */
const HEAD =
  "M -52 -10 C -52 -50 -35 -71 0 -71 C 35 -71 52 -50 52 -10 C 52 30 34 61 0 61 C -34 61 -52 30 -52 -10 Z";

const Eye: React.FC<{ cx: number; bl: number; gaze: number }> = ({ cx, bl, gaze }) => (
  <g transform={`translate(${cx} -2)`}>
    <g transform={`scale(1 ${bl})`}>
      <ellipse rx={12} ry={12.6} fill={C.white} stroke={OUT} strokeWidth={3} />
      <circle cx={gaze} cy={2} r={7.2} fill="#2E211A" />
      <circle cx={gaze + 2.6} cy={-3} r={2.3} fill="#FFF" opacity={0.9} />
    </g>
    {/* thick upper lid — stops the eyes reading as blank dots */}
    <path d="M -12 -5 Q 0 -16 12 -4" fill="none" stroke={OUT} strokeWidth={FW} strokeLinecap="round" />
  </g>
);

const Head: React.FC<{ cfg: CharConfig; name: string; expr: Expr; bl: number; open: number; gaze: number }> = ({
  cfg, name, expr, bl, open, gaze,
}) => {
  const F = (p: "skin" | "cloth" | "lower" | "hair") => `url(#${gid(name, p)})`;
  const tilt = expr === "angry" ? -14 : expr === "sad" || expr === "worried" ? 13 : expr === "happy" ? -4 : 0;
  const mY = cfg.mustache ? 4 : 0;
  const mouthPath =
    expr === "happy" ? `M -13 ${38 + mY} Q 0 ${50 + mY} 13 ${38 + mY}`
      : expr === "sad" || expr === "worried" ? `M -12 ${44 + mY} Q 0 ${36 + mY} 12 ${44 + mY}`
        : `M -12 ${40 + mY} Q 0 ${46 + mY} 12 ${40 + mY}`;

  return (
    <g transform={`translate(0 ${HEAD_Y})`}>
      {cfg.hairStyle === "bun" && <circle cx={0} cy={-66} r={26} fill={F("hair")} stroke={OUT} strokeWidth={SW} />}

      <path d={HEAD} fill={F("skin")} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />

      {/* ears — both, this is a front view */}
      <path d="M 50 -6 C 64 -9 66 16 51 18" fill={F("skin")} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
      <path d="M -50 -6 C -64 -9 -66 16 -51 18" fill={F("skin")} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />

      {/* PREMIUM: AO under the jaw, warm rim on the crown, soft cheeks */}
      <path
        d="M -50 14 C -45 42 -26 61 0 61 C 26 61 45 42 50 14 C 39 36 21 48 0 48 C -21 48 -39 36 -50 14 Z"
        fill="#2A170C" opacity={S.aoOpacity}
      />
      <path d="M -45 -32 C -36 -58 -18 -67 0 -67" fill="none" stroke="#FFE7C6" strokeWidth={4}
        opacity={S.rimOpacity} strokeLinecap="round" />
      <ellipse cx={-33} cy={22} rx={15} ry={9} fill="#C4603C" opacity={0.26} filter="url(#f-soft)" />
      <ellipse cx={33} cy={22} rx={15} ry={9} fill="#C4603C" opacity={0.26} filter="url(#f-soft)" />

      {/* hair */}
      {cfg.hairStyle === "balding" ? (
        <g>
          <path d="M -53 6 C -58 -30 -44 -60 -14 -68 C -24 -52 -30 -34 -30 -12 C -40 -10 -48 -4 -53 6 Z"
            fill={F("hair")} stroke={OUT} strokeWidth={4.4} strokeLinejoin="round" />
          <path d="M 53 6 C 58 -30 44 -60 14 -68 C 24 -52 30 -34 30 -12 C 40 -10 48 -4 53 6 Z"
            fill={F("hair")} stroke={OUT} strokeWidth={4.4} strokeLinejoin="round" />
        </g>
      ) : (
        <g>
          <path d="M -54 -4 C -56 -52 -33 -77 0 -77 C 33 -77 56 -52 54 -4 C 47 -39 27 -54 0 -54 C -27 -54 -47 -39 -54 -4 Z"
            fill={F("hair")} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M -38 -49 C -20 -62 20 -62 38 -49" fill="none" stroke="#FFFFFF" opacity={0.26} strokeWidth={3.4} strokeLinecap="round" />
          <path d="M -47 -30 C -27 -48 27 -48 47 -30" fill="none" stroke="#FFFFFF" opacity={0.15} strokeWidth={2.8} strokeLinecap="round" />
        </g>
      )}

      {/* brows — mirrored, inner ends tilt for expression */}
      <g transform={`rotate(${tilt} -21 -28)`}>
        <path d="M -35 -27 Q -21 -38 -7 -28" fill="none" stroke={OUT} strokeWidth={FW + 1.6} strokeLinecap="round" />
      </g>
      <g transform={`rotate(${-tilt} 21 -28)`}>
        <path d="M 7 -28 Q 21 -38 35 -27" fill="none" stroke={OUT} strokeWidth={FW + 1.6} strokeLinecap="round" />
      </g>

      <Eye cx={-21} bl={bl} gaze={gaze} />
      <Eye cx={21} bl={bl} gaze={gaze} />

      {/* nose: centred, one stroke + a nostril hook */}
      <path d="M 0 2 C -7 16 -9 24 -1 26 C 4 27 7 25 8 22" fill="none" stroke={OUT} strokeWidth={3.4}
        strokeLinecap="round" strokeLinejoin="round" />

      {cfg.glasses && (
        <g stroke={OUT} strokeWidth={3.4} fill="rgba(200,230,255,0.20)">
          <circle cx={-21} cy={-2} r={18} />
          <circle cx={21} cy={-2} r={18} />
          <path d="M -3 -4 L 3 -4" fill="none" />
          <path d="M -39 -6 L -51 -3" fill="none" />
          <path d="M 39 -6 L 51 -3" fill="none" />
        </g>
      )}
      {cfg.mustache && (
        <path d="M 0 28 C -11 22 -25 24 -31 32 C -20 34 -9 34 0 33 C 9 34 20 34 31 32 C 25 24 11 22 0 28 Z"
          fill={F("hair")} stroke={OUT} strokeWidth={2.8} strokeLinejoin="round" />
      )}

      {open > 0.15 ? (
        <ellipse cx={0} cy={cfg.mustache ? 46 : 42} rx={8.5 + open * 2.5} ry={3 + open * 7}
          fill="#54221F" stroke={OUT} strokeWidth={2.8} />
      ) : (
        <path d={mouthPath} fill="none" stroke={OUT} strokeWidth={FW} strokeLinecap="round" />
      )}

      {cfg.earring && (
        <>
          <circle cx={-51} cy={24} r={5} fill={C.gold} stroke={OUT} strokeWidth={2.4} />
          <circle cx={51} cy={24} r={5} fill={C.gold} stroke={OUT} strokeWidth={2.4} />
        </>
      )}
    </g>
  );
};

// ---------------- ARMS: double-stroked path, drawn IN FRONT of the body ----------------
const AW = 27;

const Arm: React.FC<{ cfg: CharConfig; name: string; side: 1 | -1; pose: ArmPose }> = ({ name, side, pose }) => {
  const sx = side * 74;
  const sy = -390;
  let d: string, hx: number, hy: number;
  if (pose === "down") {
    d = `M ${sx} ${sy} C ${sx + side * 10} -336 ${sx + side * 12} -292 ${sx + side * 8} -248`;
    hx = sx + side * 8; hy = -248;
  } else if (pose === "clasp") {
    d = `M ${sx} ${sy} C ${sx + side * 8} -340 ${sx - side * 20} -296 ${sx - side * 42} -272`;
    hx = sx - side * 42; hy = -272;
  } else {
    d = `M ${sx} ${sy} C ${sx + side * 30} -370 ${sx + side * 44} -408 ${sx + side * 34} -442`;
    hx = sx + side * 34; hy = -442;
  }
  return (
    <g>
      {/* 1. outline pass */}
      <path d={d} fill="none" stroke={OUT} strokeWidth={AW + SW * 2} strokeLinecap="round" />
      {/* 2. sleeve pass — SAME path, so the arm is never a floating capsule */}
      <path d={d} fill="none" stroke={`url(#${gid(name, "cloth")})`} strokeWidth={AW} strokeLinecap="round" />
      {/* 3. premium: rim on the lit side, AO on the shadow side */}
      <path d={d} fill="none" stroke={side < 0 ? "#FFE7C6" : "#241307"} strokeWidth={side < 0 ? 5 : AW}
        opacity={side < 0 ? 0.34 : 0.16} strokeLinecap="round" transform={`translate(${side * -5} -2)`} />
      {/* cuff + mitten hand + two finger lines */}
      <circle cx={hx} cy={hy} r={AW / 2 + 1} fill={`url(#${gid(name, "cloth")})`} stroke={OUT} strokeWidth={3.4} />
      <circle cx={hx} cy={hy + 17} r={15.5} fill={`url(#${gid(name, "skin")})`} stroke={OUT} strokeWidth={SW} />
      <path d={`M ${hx - 10} ${hy + 21} q 10 7 20 2`} fill="none" stroke={OUT} strokeWidth={2.4} strokeLinecap="round" />
      <path d={`M ${hx - 8} ${hy + 27} q 8 5 16 1`} fill="none" stroke={OUT} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  );
};

const Body: React.FC<{ cfg: CharConfig; name: string }> = ({ cfg, name }) => {
  const HEM = -208;
  const F = `url(#${gid(name, "cloth")})`;
  return (
    <g>
      <path d="M -15 -456 L 15 -456 L 15 -400 L -15 -400 Z" fill={`url(#${gid(name, "skin")})`} stroke={OUT} strokeWidth={SW} />
      <path
        d={`M -64 -400 C -80 -390 -86 -364 -86 -334 L -80 ${HEM} L 80 ${HEM} L 86 -334 C 86 -364 80 -390 64 -400 C 38 -412 -38 -412 -64 -400 Z`}
        fill={F} stroke={OUT} strokeWidth={SW} strokeLinejoin="round"
      />
      {/* PREMIUM: AO down the shadow side, rim down the lit side, AO under the collar */}
      <path d={`M 40 -406 C 64 -396 86 -370 86 -334 L 80 ${HEM} L 46 ${HEM} C 58 -286 58 -358 40 -406 Z`}
        fill="#241307" opacity={S.aoOpacity} />
      <path d="M -62 -396 C -76 -384 -82 -358 -82 -332" fill="none" stroke="#FFE7C6" strokeWidth={6} opacity={0.42} strokeLinecap="round" />
      <ellipse cx={0} cy={-398} rx={48} ry={15} fill="#241307" opacity={0.18} />
      {/* collar flaps + placket + buttons */}
      <path d="M -15 -402 L -32 -368 L -2 -360 L 0 -392 Z" fill={F} stroke={OUT} strokeWidth={3.4} strokeLinejoin="round" />
      <path d="M 15 -402 L 32 -368 L 2 -360 L 0 -392 Z" fill={F} stroke={OUT} strokeWidth={3.4} strokeLinejoin="round" />
      <path d={`M 0 -360 L 0 ${HEM + 10}`} fill="none" stroke={OUT} strokeWidth={2.6} opacity={0.6} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={0} cy={-330 + i * 38} r={5} fill="#FFFDF8" stroke={OUT} strokeWidth={2} />
      ))}
      {cfg.pocket && (
        <path d="M -62 -348 L -30 -348 L -32 -310 L -60 -310 Z" fill="none" stroke={OUT} strokeWidth={3} opacity={0.55} strokeLinejoin="round" />
      )}
    </g>
  );
};

const Legs: React.FC<{ cfg: CharConfig; name: string }> = ({ cfg, name }) => {
  const TOP = -216;
  const F = `url(#${gid(name, "lower")})`;
  return (
    <g>
      <path d={`M -66 ${TOP} C -70 -146 -68 -72 -64 -16 L -12 -16 C -10 -76 -10 -152 -8 ${TOP} Z`} fill={F} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <path d={`M 66 ${TOP} C 70 -146 68 -72 64 -16 L 12 -16 C 10 -76 10 -152 8 ${TOP} Z`} fill={F} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 52 -146 C 56 -94 56 -50 55 -18" fill="none" stroke="#FFE7C6" strokeWidth={4} opacity={0.22} strokeLinecap="round" />
      {/* both shoes point at camera */}
      <path d="M -68 -16 L -8 -16 L -6 1 C -6 6 -10 8 -18 8 L -60 8 C -67 8 -70 5 -69 -2 Z" fill={cfg.shoe} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 68 -16 L 8 -16 L 6 1 C 6 6 10 8 18 8 L 60 8 C 67 8 70 5 69 -2 Z" fill={cfg.shoe} stroke={OUT} strokeWidth={SW} strokeLinejoin="round" />
    </g>
  );
};

export type CharProps = {
  name: keyof typeof PRESET | string;
  cfg?: CharConfig;
  x: number;
  y: number;
  scale?: number;
  expr?: Expr;
  armL?: ArmPose;
  armR?: ArmPose;
  speaking?: boolean;
  phase?: number;
  blinkOffset?: number;
};

export const Character: React.FC<CharProps> = ({
  name, cfg, x, y, scale = theme.layout.charScale, expr = "neutral",
  armL = "down", armR = "down", speaking = false, phase = 0, blinkOffset = 0,
}) => {
  const frame = useCurrentFrame();
  const c = cfg ?? PRESET[name];
  const br = breathe(frame, 3.2, 112, phase);
  const bl = blink(frame, 118, blinkOffset);
  const open = mouthAmt(frame, speaking);
  const gaze = Math.sin(frame / 70 + phase) * 1.8; // alive, but still looking at camera

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* soft contact shadow — never a hard flat ellipse */}
      <ellipse cx={0} cy={6} rx={112} ry={28} fill="url(#g-pool)" />
      <g transform={`translate(0 ${br})`}>
        <Legs cfg={c} name={name} />
        <Body cfg={c} name={name} />
        {/* arms in FRONT so the hands read */}
        <Arm cfg={c} name={name} side={-1} pose={armL} />
        <Arm cfg={c} name={name} side={1} pose={armR} />
        <Head cfg={c} name={name} expr={expr} bl={bl} open={open} gaze={gaze} />
      </g>
    </g>
  );
};
