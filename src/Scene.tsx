'use client';
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";

function SceneContent({ 
  scrollProgress, 
  animations, 
  currentSection 
}: { 
  scrollProgress: number;
  animations: { 
    rotation: number;
    position: { x: number; y: number; z: number };
    scale: number;
    zoom: number;
  };
  currentSection: number;
}) {
  return (
    <>
      {/* Add ambient light */}
      <ambientLight intensity={1} />
      {/* Adjust directional light and enable shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={10}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Environment preset="city" />
      <Model 
        scrollProgress={scrollProgress} 
        animations={animations}
        currentSection={currentSection}
        receiveShadow 
      />
    </>
  );
}

export default function Scene({ 
  scrollProgress = 0,
  animations = { rotation: 0, position: { x: 0, y: 0, z: 0 }, scale: 1, zoom: 0 },
  currentSection = 0
}: { 
  scrollProgress?: number;
  animations?: { 
    rotation: number;
    position: { x: number; y: number; z: number };
    scale: number;
    zoom: number;
  };
  currentSection?: number;
}) {
  return (
    <Canvas shadows camera={{ position: [0, 2, 5], fov: 25 }}>
      <Suspense fallback={null}>
        <SceneContent 
          scrollProgress={scrollProgress} 
          animations={animations}
          currentSection={currentSection}
        />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}