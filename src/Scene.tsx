'use client';
import { Canvas, useFrame } from "@react-three/fiber";
import Model from "./Model";
import { Suspense, useState, useEffect } from "react";
import { Environment } from "@react-three/drei";

function SceneContent({ 
  animations, 
  currentSection,
  onCameraChange
}: { 
  scrollProgress: number;
  animations: { 
    rotation: number;
    rotationX: number;
    position: { x: number; y: number; z: number };
    scale: number;
    zoom: number;
    cameraPosition?: [number, number, number];
    cameraRotation?: [number, number, number];
  };
  currentSection: number;
  onCameraChange?: (pos: number[], rot: number[]) => void;
}) {
  const [headlightsOn, setHeadlightsOn] = useState(false);

  // Activer/désactiver les phares en fonction de la section
  useEffect(() => {
    // On active les phares uniquement à la dernière section (section 3)
    setHeadlightsOn(currentSection === 3);
  }, [currentSection]);

  useFrame(({ camera }) => {
    // Ajout : gestion de la position de la caméra via animations
    if (animations.cameraPosition) {
      camera.position.set(
        animations.cameraPosition[0],
        animations.cameraPosition[1],
        animations.cameraPosition[2]
      );
    }
    // Ajout : gestion de la rotation de la caméra via animations
    if (animations.cameraRotation) {
      camera.rotation.set(
        animations.cameraRotation[0],
        animations.cameraRotation[1],
        animations.cameraRotation[2]
      );
    }
    if (onCameraChange) {
      onCameraChange(
        [camera.position.x, camera.position.y, camera.position.z],
        [camera.rotation.x, camera.rotation.y, camera.rotation.z]
      );
    }
  });

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

      {/* Maintenant le modèle gère ses propres phares */}
      <Model 
        animations={animations}
        headlightsOn={headlightsOn}
      />
    </>
  );
}

export default function Scene({ 
  scrollProgress = 0,
  animations = { rotation: 0, rotationX: 0, position: { x: 0, y: 0, z: 0 }, scale: 1, zoom: 0 },
  currentSection = 0
}: { 
  scrollProgress?: number;
  animations?: { 
    rotation: number;
    rotationX: number;
    position: { x: number; y: number; z: number };
    scale: number;
    zoom: number;
    cameraPosition?: [number, number, number];
    cameraRotation?: [number, number, number];
  };
  currentSection?: number;
}) {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 25 }}>
        <Suspense fallback={null}>
          <SceneContent 
            scrollProgress={scrollProgress} 
            animations={animations}
            currentSection={currentSection}
          />
        </Suspense>
      </Canvas>
    </>
  );
}