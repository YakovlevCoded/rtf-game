import { useRef, useEffect } from "react";
import useGame from "./useGame.jsx";
import { addEffect } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";

export default function Interface() {
  const time = useRef();
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);
  const jump = useKeyboardControls((state) => state.jump);

  const phase = useGame((state) => state.phase);
  const setPhase = useGame((state) => state.setPhase);
  const restart = () => setPhase("restart");

  useEffect(() => {
    const unsubrcribe = addEffect(() => {
      const state = useGame.getState();
      let elapsedTime = 0;

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
        // if (elapsedTime > 10000) {
        //   setPhase("ended");
        // }
      }

      if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime;
        // console.log(`Game ended in ${elapsedTime}ms`);
      }

      elapsedTime = elapsedTime / 1000;
      elapsedTime = elapsedTime.toFixed(2);

      if (time.current) {
        time.current.innerText = elapsedTime;
      }
    });
    return () => {
      unsubrcribe();
    };
  }, []);

  return (
    <div className="interface">
      <div ref={time} className="time">
        {phase}
      </div>
      {phase === "ended" && (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${left ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${right ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? "active" : ""}`}></div>
        </div>
      </div>
    </div>
  );
}
