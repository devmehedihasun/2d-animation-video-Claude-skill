# অর্ণব — The Psychology of Money (sus.lessons-style Bengali 2D Reel)

A 9:16 (1080×1920, 30fps) Bengali 2D cartoon storytelling reel built with
**Remotion** from an `.srt` voiceover. Colour scheme **Urban Teal**; cast and
props drawn entirely in code (SVG). ~95s.

Story: অর্ণব buys a ₹1,00,000 phone on EMI to impress colleagues, ends up with
zero savings, and faces a family medical emergency — the lesson from Morgan
Housel's *The Psychology of Money*.

## Run it

```bash
npm install
npm run sfx        # (re)generate the synthesized SFX kit into public/sfx/
npm run studio     # preview in Remotion Studio at http://localhost:3000
npm run render     # render to out/video.mp4 (H.264 + AAC)
```

If Remotion can't auto-download Chromium (offline/CI), pass a browser binary:

```bash
npx remotion render src/index.ts Main out/video.mp4 \
  --codec h264 --crf 17 --concurrency 2 \
  --browser-executable=/path/to/chrome-headless-shell
```

Verify single frames:

```bash
npx remotion still src/index.ts Main out/check.png --frame 1500 --overwrite
```

## Project structure

```
public/fonts/      Hind Siliguri + Noto Serif Bengali + Playfair (local woff2, no network)
public/sfx/        synthesized WAV kit (whoosh, stamp, tick, tear, pop, bass)
scripts/make-sfx.mjs   regenerates the SFX kit (zero deps)
src/
  index.ts         registerRoot
  Root.tsx         <Composition> — 1080x1920, fps 30, duration from script
  theme.ts         ONE theme object: colours, easings, springs, fonts, layout
  srt.ts           SRT parser + timing helpers
  script.ts        curated subtitles, context pills, counters, scene windows
  anim.ts          spring/entrance/exit/breathe/blink helpers (no linear easing)
  Characters.tsx   modular flat-2D SVG cast (Arnab, Rohit, Mother, Father, Doctor)
  Backgrounds.tsx  office / apartment / hospital rooms + cutaway + wine stages + grain
  PropsUI.tsx      counter, stamp, callout, checklist, phone, book card, moral card, bubble
  SubtitlesHUD.tsx brand pill + context sub-pill + word-by-word highlighted subtitle card
  sfx.ts           SFX placement manifest
  scenes/Scenes.tsx   8 scenes synced to SRT timestamps
  Main.tsx         orchestration (Sequences) + HUD + SFX + grade
```

## Editing

- **Colours:** change the palette in `src/theme.ts` (one place).
- **Subtitles / timing / highlighted words:** `src/script.ts` (`SUBS`, `CONTEXT`).
- **Cast looks:** `PRESET` in `src/Characters.tsx`.
- **Numbers on counters/stamps:** the scene files in `src/scenes/Scenes.tsx`.
- To build a different story: drop in a new `.srt`, update `src/script.ts`
  (subtitles + scene windows) and the per-scene props.

## Notes

- Bengali text uses word-level animation only with `letterSpacing: 0`, so
  যুক্তাক্ষর (conjuncts) stay intact.
- The book reference uses a **generic drawn icon** — no copyrighted cover/still.
- Add the real voiceover as `public/vo.mp3` and an `<Audio>` in `Main.tsx` for
  narration; SFX timings already align to the SRT.
