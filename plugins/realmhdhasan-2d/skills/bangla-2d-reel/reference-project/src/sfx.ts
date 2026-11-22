// SFX manifest. 5-7 sounds for the whole video, each firing 2-3 frames
// BEFORE its visual HIT. Volume 0.20-0.35, never above.
export type SfxCue = { file: string; atSec: number; vol?: number };

export const SFX: SfxCue[] = [
  { file: "pop.wav", atSec: 0.10, vol: 0.30 },   // first character in
  { file: "pop.wav", atSec: 0.37, vol: 0.26 },   // second character in
  { file: "whoosh.wav", atSec: 0.62, vol: 0.26 },// subtitle plate in
  { file: "stamp.wav", atSec: 2.74, vol: 0.34 }, // pinned stat HIT
  { file: "bass.wav", atSec: 2.74, vol: 0.22 },
  { file: "tick.wav", atSec: 3.20, vol: 0.20 },  // plate grows for line 2
];
