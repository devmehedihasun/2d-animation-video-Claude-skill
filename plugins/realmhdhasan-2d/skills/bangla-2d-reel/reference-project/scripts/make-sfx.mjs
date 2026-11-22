// Synthesize a tiny 16-bit WAV SFX kit into public/sfx/. Zero dependencies.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "sfx");
mkdirSync(OUT, { recursive: true });

const SR = 44100;

function wav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE((s * 32767) | 0, 44 + i * 2);
  }
  return buf;
}
const env = (i, n, a = 0.01, r = 0.3) => {
  const t = i / n;
  const atk = Math.min(1, i / (a * n));
  const rel = t > 1 - r ? Math.max(0, (1 - t) / r) : 1;
  return atk * rel;
};
const noise = () => Math.random() * 2 - 1;

function make(name, durSec, fn) {
  const n = Math.floor(SR * durSec);
  const s = new Float32Array(n);
  for (let i = 0; i < n; i++) s[i] = fn(i, n);
  writeFileSync(join(OUT, name), wav(s));
  console.log("wrote", name);
}

// whoosh — filtered noise sweep
let lp = 0;
make("whoosh.wav", 0.5, (i, n) => {
  const cut = 0.02 + 0.25 * (i / n);
  lp += (noise() - lp) * cut;
  return lp * env(i, n, 0.15, 0.5) * 0.5;
});

// pop — quick sine with pitch drop
make("pop.wav", 0.18, (i, n) => {
  const t = i / SR;
  const f = 520 - 300 * (i / n);
  return Math.sin(2 * Math.PI * f * t) * env(i, n, 0.01, 0.6) * 0.5;
});

// stamp — thud: low sine + noise burst
make("stamp.wav", 0.32, (i, n) => {
  const t = i / SR;
  const f = 180 - 120 * (i / n);
  const body = Math.sin(2 * Math.PI * f * t);
  const click = noise() * (i < n * 0.08 ? 1 : 0);
  return (body * 0.7 + click * 0.5) * env(i, n, 0.005, 0.5) * 0.6;
});

// tick — short high click
make("tick.wav", 0.06, (i, n) => {
  const t = i / SR;
  return Math.sin(2 * Math.PI * 1400 * t) * env(i, n, 0.01, 0.8) * 0.35;
});

// tear — tiny descending blip
make("tear.wav", 0.22, (i, n) => {
  const t = i / SR;
  const f = 900 - 500 * (i / n);
  return Math.sin(2 * Math.PI * f * t) * env(i, n, 0.02, 0.7) * 0.3;
});

// bass — soft kick on cuts
make("bass.wav", 0.4, (i, n) => {
  const t = i / SR;
  const f = 90 - 40 * (i / n);
  return Math.sin(2 * Math.PI * f * t) * env(i, n, 0.005, 0.6) * 0.6;
});

console.log("SFX kit done.");
