import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { theme } from "./theme";
import { ensureFonts } from "./fonts";
import { PremiumDefs } from "./Defs";
import { Character, PRESET } from "./Characters";
import { RoomBase, DepthLayer, LivingRoomProps, SceneLight, FloorGlow, Vignette, Sparkles, Grade } from "./Backgrounds";
import { BrandPill, ContextPill, SubtitlePanel, PinnedStat } from "./SubtitlesHUD";
import { LINE1, LINE2, CONTEXT_LABEL, STAT, END_SEC } from "./script";
import { SFX } from "./sfx";
import { clampOpts } from "./anim";

/** set true once you have dropped public/voiceover.mp3 in place */
const HAS_VOICEOVER = false;

export const DURATION_IN_FRAMES = Math.round(END_SEC * theme.layout.fps);

/** slow camera push — 5% over the whole shot. Cheap, and it reads as film. */
const usePush = () => {
  const frame = useCurrentFrame();
  return interpolate(frame / DURATION_IN_FRAMES, [0, 1], [1, 1.052], { ...clampOpts, easing: theme.ease.inOut });
};

export const Main: React.FC = () => {
  ensureFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = usePush();

  const eF = spring({ frame: frame - 3, fps, config: theme.spring.gentle, durationInFrames: 24 });
  const eS = spring({ frame: frame - 11, fps, config: theme.spring.gentle, durationInFrames: 24 });
  const rise = (p: number) => interpolate(p, [0, 1], [64, 0], clampOpts);

  return (
    <AbsoluteFill style={{ background: theme.color.wall }}>
      <svg viewBox={`0 0 ${theme.layout.W} ${theme.layout.H}`} style={{ position: "absolute", inset: 0 }}>
        <PremiumDefs cast={PRESET} />

        <g transform={`translate(540 960) scale(${push}) translate(-540 -960)`}>
          <RoomBase />
          <DepthLayer><LivingRoomProps /></DepthLayer>
          <SceneLight preset="warmRoom" />

          <g opacity={eF} transform={`translate(0 ${rise(eF)})`}>
            <Character name="father" x={356} y={1418} scale={1.42}
              expr={frame > 96 ? "sad" : "neutral"} armL="down" armR="clasp"
              speaking={frame > 28 && frame < 92} phase={0} blinkOffset={0} />
          </g>
          <g opacity={eS} transform={`translate(0 ${rise(eS)})`}>
            <Character name="son" x={730} y={1428} scale={1.46}
              expr={frame > 96 ? "sad" : "neutral"} armL="clasp" armR="down"
              speaking={frame > 100 && frame < 164} phase={1.4} blinkOffset={52} />
          </g>

          <FloorGlow />
          <Vignette />
          <Sparkles />
        </g>

        {/* HUD never pushes with the camera — it is screen furniture */}
        <BrandPill />
        <ContextPill label={CONTEXT_LABEL} />
        <PinnedStat label={STAT.label} value={STAT.value} start={84} />
        <SubtitlePanel line1={LINE1} line2={LINE2} start1={20} start2={98} />
      </svg>

      <Grade />

      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.atSec * fps)} durationInFrames={Math.ceil(fps * 0.9)} name={`sfx-${i}`}>
          <Audio src={staticFile(`sfx/${s.file}`)} volume={s.vol ?? 0.3} />
        </Sequence>
      ))}

      {HAS_VOICEOVER && <Audio src={staticFile("voiceover.mp3")} />}
    </AbsoluteFill>
  );
};
