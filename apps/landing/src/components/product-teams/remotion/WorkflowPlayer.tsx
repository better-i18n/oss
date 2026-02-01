"use client";

import { Player } from "@remotion/player";
import { useMemo } from "react";
import { WorkflowComposition } from "./WorkflowComposition";

export default function WorkflowPlayer() {
  // Memoize inputProps to prevent unnecessary re-renders
  const inputProps = useMemo(
    () => ({
      text: "Save Changes",
    }),
    []
  );

  return (
    <div className="w-full aspect-[16/6] rounded-xl overflow-hidden">
      <Player
        component={WorkflowComposition}
        inputProps={inputProps}
        durationInFrames={300}
        fps={30}
        compositionWidth={1600}
        compositionHeight={600}
        style={{
          width: "100%",
          height: "100%",
        }}
        controls={false}
        autoPlay
        loop
      />
    </div>
  );
}
