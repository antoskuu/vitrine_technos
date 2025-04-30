'use client';
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";

function SceneContent({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      {/* Add ambient light */}
      <ambientLight intensity={0.5} />
      {/* Adjust directional light and enable shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Environment preset="city" />
      <Model scrollProgress={scrollProgress} receiveShadow />
    </>
  );
}

export default function Scene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
      <Suspense fallback={null}>
        <SceneContent scrollProgress={scrollProgress} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}