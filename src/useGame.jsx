import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      blocksCount: 30,
      blockSeed: 0,
      phase: "ready",
      startTime: null,
      endTime: null,
      setPhase: (phase) =>
        set((state) => {
          const restartCase = state.phase === "ended" && phase === "playing";
          const endCase = state.phase === "playing" && phase === "ended";
          const startCase = state.phase === "ready" && phase === "playing";

          if (startCase) {
            return {
              phase,
              startTime: Date.now(),
            };
          }

          if (endCase) {
            return {
              phase,
              endTime: Date.now(),
            };
          }

          if (state.phase !== phase && !restartCase) {
            return {
              phase,
            };
          }
          return {};
        }),

      increaseBlockSeed: () => {
        set((state) => {
          return {
            blockSeed: state.blockSeed + 1,
          };
        });
      },
    };
  })
);
