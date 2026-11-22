import React from "react";
import { Composition } from "remotion";
import { Main, DURATION_IN_FRAMES } from "./Main";
import { theme } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={theme.layout.fps}
        width={theme.layout.W}
        height={theme.layout.H}
      />

    </>
  );
};
