import React, { memo } from "react";
import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import Level from "./Level.jsx";
import Player from "./Player.jsx";
import Effects from "./Effects.jsx";
import useGame from "./useGame.jsx";

function ExperienceComponent() {
  const blocksCount = useGame((state) => state.blocksCount);
  return (
    <>
      <Physics>
        <Lights />
        <Level count={blocksCount} />
        <Player />
      </Physics>
      {/* <Effects /> */}
    </>
  );
}

export const Experience = memo(ExperienceComponent);
