// Minimal SRT parser + timing helpers.
// (The curated, display-ready subtitles live in script.ts; this parser is the
//  reusable piece the skill calls for and is used to sanity-check timings.)

export type RawCue = {
  index: number;
  fromSec: number;
  toSec: number;
  text: string;
};

const toSec = (t: string): number => {
  // 00:00:05,840
  const m = t.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) return 0;
  const [, h, mm, s, ms] = m;
  return +h * 3600 + +mm * 60 + +s + +ms / 1000;
};

export const parseSrt = (raw: string): RawCue[] => {
  const blocks = raw.replace(/\r/g, "").trim().split(/\n\s*\n/);
  const cues: RawCue[] = [];
  for (const b of blocks) {
    const lines = b.split("\n");
    if (lines.length < 2) continue;
    const idx = parseInt(lines[0], 10);
    const tl = lines.find((l) => l.includes("-->"));
    if (!tl) continue;
    const [from, to] = tl.split("-->");
    cues.push({
      index: isNaN(idx) ? cues.length + 1 : idx,
      fromSec: toSec(from),
      toSec: toSec(to),
      text: lines
        .slice(lines.indexOf(tl) + 1)
        .join(" ")
        .trim(),
    });
  }
  return cues;
};

export const secToFrame = (sec: number, fps: number) => Math.round(sec * fps);
