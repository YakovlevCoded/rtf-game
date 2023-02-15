import * as THREE from "three";
import React, { useMemo, useRef, useState } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Text, Float } from "@react-three/drei";
import useGame from "./useGame.jsx";

THREE.ColorManagement.legacyMode = false;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floorMaterial = new THREE.MeshStandardMaterial({
  color: "limegreen",
});
const floor2Material = new THREE.MeshStandardMaterial({
  color: "greenyellow",
});
const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: "orangered",
});
const wallMaterial = new THREE.MeshStandardMaterial({
  color: "slategray",
});

function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          scale={0.5}
          position={[-0.75, 0.65, -1]}
          maxWidth={0.25}
          lineHeight={0.75}
          rotation-y={0.25}
        >
          Let's go!
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        material={floorMaterial}
        position={[0, -0.1, 0]}
        receiveShadow
        scale={[4, 0.2, 4]}
      ></mesh>
    </group>
  );
}

function BlockSpinner({ position = [0, 0, 0] }) {
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? 1 : -1)
  );
  const obstacle = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed * 2, 0));
    obstacle.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

function BlockLimbo({ position = [0, 0, 0] }) {
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  const obstacle = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time + timeOffset) + 1.15;
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

function BlockAxe({ position = [0, 0, 0] }) {
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  const obstacle = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time + timeOffset) * 1.25;

    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      ></mesh>
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
        ></mesh>
      </RigidBody>
    </group>
  );
}

function BlockEnd({ position = [0, 0, 0] }) {
  const hamberger = useGLTF("/hamburger.glb");
  hamberger.scene.children.forEach((child) => {
    child.castShadow = true;
  });
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          scale={0.5}
          position={[0, 2.25, 1.2]}
          maxWidth={0.25}
          lineHeight={0.75}
          rotation-y={0.25}
        >
          FINISH
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        material={floorMaterial}
        position={[0, 0, 0]}
        receiveShadow
        scale={[4, 0.2, 4]}
      ></mesh>
      <RigidBody
        position={[0, 0.25, 0]}
        type="fixed"
        colliders="hull"
        restitution={0.2}
        friction={0}
      >
        <primitive object={hamberger.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
}

function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          position={[2.15, 0.75, -length * 2 + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, length * 4]}
          castShadow
        />
        <mesh
          position={[-2.15, 0.75, -length * 2 + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, length * 4]}
          receiveShadow
        />
        <mesh
          position={[0, 0.75, -length * 4 + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.5, 0.3]}
          receiveShadow
        />
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -length * 2 + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
}

export default function Level({
  count = 5,
  types = [BlockSpinner, BlockLimbo, BlockAxe],
}) {
  const seed = useGame((state) => state.blockSeed);
  const blocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      arr.push(type);
    }
    return arr;
  }, [types, count, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, i) => (
        <Block key={i} position={[0, 0, -(i + 1) * 4]} />
      ))}
      <Bounds length={count + 2} />
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
    </>
  );
}
