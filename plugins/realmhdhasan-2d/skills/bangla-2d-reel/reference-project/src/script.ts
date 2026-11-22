// ============================================================
// Demo story data. In a real build this is generated from the .srt:
// one cue -> one beat, frame range = round(startSec*fps) .. round(endSec*fps).
// ============================================================
import type { Word } from "./SubtitlesHUD";

/**
 * ONE switch drives the whole project. Never hardcode this in a component.
 *  "hook" — only the HOOKS windows mount a panel; the rest of the VO runs clean.
 *  "full" — every SRT cue gets a panel line, synced to the voiceover.
 */
export const SUBTITLE_MODE: "hook" | "full" = "full";

export const END_SEC = 6.5;

export const LINE1: Word[] = [
  { t: "বাবা" }, { t: "কোনোদিন" }, { t: "বলেননি" }, { t: "ভালোবাসি", accent: true },
];

export const LINE2: Word[] = [
  { t: "শুধু" }, { t: "চুপচাপ" }, { t: "পাশে", accent: true }, { t: "দাঁড়িয়ে", accent: true }, { t: "থেকেছেন" },
];

export const CONTEXT_LABEL = "সন্ধ্যা ৭টা";
export const STAT = { label: "একসাথে বছর", value: 32 };

/**
 * hook mode only: 3-6 punch lines, each <= 7 words, with their SRT window.
 * Outside these windows the panel is NOT rendered at all.
 */
export const HOOKS: Array<{ from: number; to: number; line: Word[] }> = [
  { from: 0.9, to: 4.2, line: LINE1 },
  { from: 4.4, to: 6.5, line: LINE2 },
];
