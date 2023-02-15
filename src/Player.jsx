import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import useGame from "./useGame.jsx";

export default function Player() {
  const body = useRef();
  const setPhase = useGame((state) => state.setPhase);
  const increaseBlockSeed = useGame((state) => state.increaseBlockSeed);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [smoothedPosition] = useState(new Vector3(10, 10, 10));
  const [smoothedTarget] = useState(new Vector3());

  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 0.311;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);

    if (hit?.toi < 0.15) {
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
    }
  };

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
    setPhase("ready");
    increaseBlockSeed();
  };

  const blocksCount = useGame((state) => state.blocksCount);

  useEffect(() => {
    const unsubscribe = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      }
    );

    const unubscribeAny = subscribeKeys(() => {
      setPhase("playing");
    });

    const unubscribeStore = useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        switch (phase) {
          case "restart":
            reset();
            break;
          default:
            break;
        }
      }
    );

    return () => {
      unsubscribe();
      unubscribeAny();
      unubscribeStore();
    };
  }, []);

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    switch (true) {
      case forward:
        impulse.z -= impulseStrength;
        torque.x -= torqueStrength;
        break;
      case backward:
        impulse.z += impulseStrength;
        torque.x += torqueStrength;
        break;
      case left:
        impulse.x -= impulseStrength;
        torque.z += torqueStrength;
        break;
      case right:
        impulse.x += impulseStrength;
        torque.z -= torqueStrength;
        break;
      default:
        break;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    // Camera
    const bodyPosition = body.current.translation();

    const cameraPosition = new Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.y += 0.65;
    cameraPosition.z += 2.25;

    const cameraTarget = new Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothedPosition.lerp(cameraPosition, 5 * delta);
    smoothedTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothedPosition);
    state.camera.lookAt(smoothedTarget);

    if (bodyPosition.z < -(blocksCount * 4 + 2)) {
      setPhase("ended");
    }

    if (bodyPosition.y < -4) {
      setPhase("restart");
    }
  });

  return (
    <>
      <RigidBody
        ref={body}
        position={[0, 1, 0]}
        colliders="ball"
        restitution={0.2}
        friction={1}
        linearDamping={0.5}
        angularDamping={0.5}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>
      </RigidBody>
    </>
  );
}
