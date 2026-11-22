import { interpolate, spring } from "remotion";
import { theme } from "./theme";

// Reusable motion helpers. Every entrance here animates 2–3 properties and
// every interpolate is clamped. No linear easing anywhere.

export const clampOpts = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Spring 0->1 entrance progress
export const enter = (
  frame: number,
  fps: number,
  delay = 0,
  preset: keyof typeof theme.spring = "pop"
) =>
  spring({
    frame: frame - delay,
    fps,
    config: theme.spring[preset],
    durationInFrames: 22,
  });

// Entrance transform: fade + rise + scale, together
export const entrance = (p: number, rise = 40, fromScale = 0.9) => ({
  opacity: interpolate(p, [0, 1], [0, 1], clampOpts),
  transform: `translateY(${interpolate(p, [0, 1], [rise, 0], clampOpts)}px) scale(${interpolate(
    p,
    [0, 1],
    [fromScale, 1],
    clampOpts
  )})`,
});

// Exit progress 0->1 over the last `dur` frames of a window of length `total`
export const exit = (localFrame: number, total: number, dur = 10) =>
  interpolate(localFrame, [total - dur, total], [0, 1], clampOpts);

// Combined in/out container style (enter, hold, fast exit)
export const inOut = (
  localFrame: number,
  total: number,
  fps: number,
  delay = 0,
  rise = 40,
  preset: keyof typeof theme.spring = "pop"
) => {
  const ein = enter(localFrame, fps, delay, preset);
  const eout = exit(localFrame, total, 10);
  const opacity =
    interpolate(ein, [0, 1], [0, 1], clampOpts) *
    interpolate(eout, [0, 1], [1, 0], clampOpts);
  const y =
    interpolate(ein, [0, 1], [rise, 0], clampOpts) +
    interpolate(eout, [0, 1], [0, -18], clampOpts);
  const s =
    interpolate(ein, [0, 1], [0.9, 1], clampOpts) *
    interpolate(eout, [0, 1], [1, 0.96], clampOpts);
  return { opacity, transform: `translateY(${y}px) scale(${s})` };
};

// Idle breathing — low-amplitude sine. Anything on screen > 2s uses this.
export const breathe = (frame: number, amp = 4, periodFrames = 110, phase = 0) =>
  Math.sin((frame / periodFrames) * Math.PI * 2 + phase) * amp;

// Blink: returns scaleY (1 normally, ~0.1 during a blink) roughly every `every` frames
export const blink = (frame: number, every = 115, offset = 0) => {
  const t = (frame + offset) % every;
  if (t < 3) return interpolate(t, [0, 1.5, 3], [1, 0.1, 1], clampOpts);
  return 1;
};

// Mouth open amount 0..1 oscillating while "speaking"
export const mouth = (frame: number, speaking: boolean) => {
  if (!speaking) return 0;
  const v = (Math.sin(frame * 0.9) + Math.sin(frame * 1.7 + 1)) * 0.5;
  return Math.max(0, v) * 0.9 + 0.1;
};

// Stagger delay for the i-th item
export const stagger = (i: number, step = 4) => i * step;
