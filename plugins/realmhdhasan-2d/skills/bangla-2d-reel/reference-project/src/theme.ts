import { Easing } from "remotion";

// ============================================================
// realmhdhasan 2D — ONE theme object.
// No component may inline a hex, an easing or a shade multiplier.
// Values marked (ref) were pixel-sampled from the reference reels.
// ============================================================

export const theme = {
  color: {
    // ---- room / stage ----
    wallHi: "#F3E7CF",
    wall: "#DFCDAB",
    wallLo: "#AE946F",
    wainscot: "#A9794B",
    skirt: "#7E5636",
    floor: "#8E5340",
    floorLo: "#6F4133",
    floorLine: "#5E3328",

    // ---- premium text panel (ref: subtitle bar) ----
    panel: "#1D3A2C",
    panelLo: "#14291F",
    panelHi: "#274938",

    // ---- type ----
    cream: "#F6EFDF",   // normal subtitle word
    gold: "#F0C86A",    // ACCENT word  (ref #E9C766 / #F3D081) — never red
    goldDeep: "#C79A47",// panel border / hairline
    inkDark: "#10231B", // glyph stroke + text shadow

    // ---- line art ----
    outline: "#26201C",

    // ---- supporting ----
    stampRed: "#B33030", // push-pin only, never type
    teal: "#2C6E72",
    warm: "#FFD9A0",     // key-light tint
    white: "#F8F4EC",
  },

  // ---- PREMIUM FILL: the whole look lives in these 5 numbers ----
  // (ref) skin shades to 0.90x, cloth to 0.83x of its lit value.
  shade: {
    skinMul: 0.9,
    clothMul: 0.83,
    hairMul: 0.88,
    aoOpacity: 0.24,  // ambient-occlusion wedges
    rimOpacity: 0.62, // warm rim light on the lit edge
    lightTint: 0.22,  // how much `warm` bleeds into the lit stop
    holdStop: 0.64,   // gradient hold % — keeps it cel-shaded, not airbrushed
  },

  // ---- PREMIUM GLOW: one light source per scene, never more ----
  light: {
    warmRoom: { x: 860, y: 270, r: 250, color: "#FFD9A0", intensity: 0.22 },
    coolNight: { x: 540, y: 420, r: 300, color: "#7FA8C9", intensity: 0.18 },
    bloomOpacity: 0.34,
    vignetteOpacity: 0.46,
    dofBlur: 8,       // background props + background characters
    dofBlurNear: 3,   // mid-ground
  },

  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    outBack: Easing.bezier(0.34, 1.56, 0.64, 1),
    in: Easing.bezier(0.5, 0, 0.75, 0),
  },

  spring: {
    pop: { damping: 13, stiffness: 200, mass: 0.65 },
    soft: { damping: 15, stiffness: 160, mass: 0.85 },
    stampy: { damping: 9, stiffness: 220, mass: 0.8 },
    gentle: { damping: 16, stiffness: 150, mass: 0.9 },
  },

  font: {
    // Bengali subtitle / HUD / cards — flared terminals, matches the reference
    bn: "'Noto Serif Bengali', serif",
    // Bengali small UI only
    bnUi: "'Hind Siliguri', sans-serif",
    latinSerif: "'Playfair Display', serif",
  },

  brand: "— realmhdhasan —",

  layout: {
    W: 1080,
    H: 1920,
    fps: 30,
    safeTop: 150,
    subtitleCY: 1548, // panel CENTRE — raised off the bottom (ref ~1540-1580)
    feetY: 1418,      // character foot line
    charScale: 1.44,
  },
} as const;

export type Theme = typeof theme;

// ---- colour maths used by the gradient factory ----
const hx2rgb = (h: string): [number, number, number] => {
  const s = h.replace("#", "");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
};
const rgb2hx = (r: number, g: number, b: number) => {
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`;
};
/** darken a hex by a multiplier — the premium shade stop */
export const shade = (hex: string, mul: number) => {
  const [r, g, b] = hx2rgb(hex);
  return rgb2hx(r * mul, g * mul, b * mul);
};
/** blend `hex` toward `target` by `amt` — the warm key-light stop */
export const tint = (hex: string, target: string, amt: number) => {
  const [r, g, b] = hx2rgb(hex);
  const [R, G, B] = hx2rgb(target);
  return rgb2hx(r + (R - r) * amt, g + (G - g) * amt, b + (B - b) * amt);
};
