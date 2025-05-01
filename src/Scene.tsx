'use client';
import { Canvas, useFrame } from "@react-three/fiber";
import Model from "./Model";
import { Suspense, useState, useRef } from "react";
import { Environment, Text } from "@react-three/drei";

function CameraDebugOverlay({ position, rotation }: { position: number[], rotation: number[] }) {
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 10,
      background: 'rgba(0,0,0,0.7)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 6,
      fontSize: 12,
      zIndex: 10000,
      pointerEvents: 'none'
    }}>
      <div><b>Camera Position:</b> {position.map(n => n.toFixed(2)).join(', ')}</div>
      <div><b>Camera Rotation:</b> {rotation.map(n => n.toFixed(2)).join(', ')}</div>
    </div>
  );
}

function SceneContent({ 
  scrollProgress, 
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
  const axesRef = useRef<any>(null);

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
      {/* Ajout des axes colorés */}
      <axesHelper ref={axesRef} args={[2]} />
      {/* Labels pour les axes */}
      <Text position={[2.2, 0, 0]} fontSize={0.2} color="red" anchorX="center" anchorY="middle">X</Text>
      <Text position={[0, 2.2, 0]} fontSize={0.2} color="green" anchorX="center" anchorY="middle">Y</Text>
      <Text position={[0, 0, 2.2]} fontSize={0.2} color="blue" anchorX="center" anchorY="middle">Z</Text>
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
  const [camPos, setCamPos] = useState([0, 2, 5]);
  const [camRot, setCamRot] = useState([0, 0, 0]);
  return (
    <>
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 25 }}>
        <Suspense fallback={null}>
          <SceneContent 
            scrollProgress={scrollProgress} 
            animations={animations}
            currentSection={currentSection}
            onCameraChange={(pos, rot) => {
              setCamPos(pos);
              setCamRot(rot);
            }}
          />
        </Suspense>
      </Canvas>
      <CameraDebugOverlay position={camPos} rotation={camRot} />
    </>
  );
}