import { useRef, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { SpotLight, useGLTF, MeshDistortMaterial, Trail } from "@react-three/drei"
import * as THREE from "three"

interface HeadlightsProps {
  position?: [number, number, number]
  scale?: number
  intensity?: number
  color?: string
  angle?: number
  penumbra?: number
  distance?: number
  castShadow?: boolean
  attenuation?: number
  anglePower?: number
  isOn?: boolean
  volumetric?: boolean
  volumetricWidth?: number
  glow?: boolean
}

export default function Headlights({
  position = [0, 0, 0],
  scale = 50,
  intensity = 2,
  color = "#ffffff",
  angle = 1,
  penumbra = 0.5,
  distance = 10,
  castShadow = false,
  attenuation = 2,
  anglePower = 10,
  isOn = true,
  volumetric = true,
  volumetricWidth = 0.6,
  glow = true
}: HeadlightsProps) {
  const leftLightRef = useRef<any>(null)
  const rightLightRef = useRef<any>(null)
  const leftTargetRef = useRef<THREE.Object3D>(null)
  const rightTargetRef = useRef<THREE.Object3D>(null)
  const leftBeamRef = useRef<THREE.Mesh>(null)
  const rightBeamRef = useRef<THREE.Mesh>(null)
  const [currentIntensity, setCurrentIntensity] = useState(isOn ? intensity : 0);

  // Transition douce de l'intensité
  useEffect(() => {
    let frame: number;
    function animate() {
      setCurrentIntensity(prev => {
        const target = isOn ? intensity : 0;
        // Interpolation linéaire douce
        const speed = 0.08; // Plus petit = plus lent
        const next = prev + (target - prev) * speed;
        // Si très proche de la cible, snap
        if (Math.abs(next - target) < 0.01) return target;
        return next;
      });
      frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [isOn, intensity]);

  // Calculer les positions des phares en fonction de l'échelle
  const leftPosition: [number, number, number] = [
    position[0] - 3.95 * scale, 
    position[1] - 2.7 * scale, 
    position[2] + 3 * scale
  ]
  
  const rightPosition: [number, number, number] = [
    position[0] - 1.5 * scale,
    position[1] -2.7 * scale,
    position[2] + 3 * scale
  ]
  
  // Positions des targets (où les phares pointent)
  const leftTargetPos: [number, number, number] = [
    leftPosition[0], 
    leftPosition[1], 
    leftPosition[2] + 100
  ]
  
  const rightTargetPos: [number, number, number] = [
    rightPosition[0],
    rightPosition[1],
    rightPosition[2] + 100
  ]
  
  // Calculer la direction du faisceau pour le rendu volumétrique
  const leftDirection = new THREE.Vector3(
    leftTargetPos[0] - leftPosition[0],
    leftTargetPos[1] - leftPosition[1],
    leftTargetPos[2] - leftPosition[2]
  ).normalize();
  
  const rightDirection = new THREE.Vector3(
    rightTargetPos[0] - rightPosition[0],
    rightTargetPos[1] - rightPosition[1],
    rightTargetPos[2] - rightPosition[2]
  ).normalize();
  
  // Effet de scintillement léger pour plus de réalisme
  useFrame((state) => {
    if (!isOn) {
      // Si les phares sont éteints, on s'assure que l'intensité est à zéro
      if (leftLightRef.current) leftLightRef.current.intensity = currentIntensity;
      if (rightLightRef.current) rightLightRef.current.intensity = currentIntensity;
      
      // S'assurer que les faisceaux sont complètement invisibles
      if (leftBeamRef.current && leftBeamRef.current.material) {
        leftBeamRef.current.material.opacity = 0;
        leftBeamRef.current.visible = false;
      }
      
      if (rightBeamRef.current && rightBeamRef.current.material) {
        rightBeamRef.current.material.opacity = 0;
        rightBeamRef.current.visible = false;
      }
      
      return;
    }
    
    // Si les phares sont allumés, s'assurer que les faisceaux sont visibles
    if (volumetric) {
      if (leftBeamRef.current) leftBeamRef.current.visible = true;
      if (rightBeamRef.current) rightBeamRef.current.visible = true;
    }
    
    // Scintillement plus complexe avec plusieurs fréquences
    const time = state.clock.elapsedTime
    const primaryFlicker = Math.sin(time * 8) * 0.04
    const secondaryFlicker = Math.sin(time * 12) * 0.02
    const tertiaryFlicker = Math.sin(time * 20) * 0.01
    const flickerAmount = 0.95 + primaryFlicker + secondaryFlicker + tertiaryFlicker
    
    if (leftLightRef.current) {
      leftLightRef.current.intensity = currentIntensity * flickerAmount
    }
    
    if (rightLightRef.current) {
      rightLightRef.current.intensity = currentIntensity * flickerAmount
    }
    
    // Animation des faisceaux volumétriques
    if (volumetric) {
      if (leftBeamRef.current) {
        leftBeamRef.current.material.opacity = (0.4 + primaryFlicker) * (isOn ? 1 : 0)
      }
      
      if (rightBeamRef.current) {
        rightBeamRef.current.material.opacity = (0.4 + primaryFlicker) * (isOn ? 1 : 0)
      }
    }
  })
  
  // Fonction pour créer un faisceau volumétrique
  const VolumetricBeam = ({ position, direction, width, color }: any) => {
    // Calculer la position médiane du faisceau
    const midPosition: [number, number, number] = [
      position[0] + direction.x * 5,
      position[1] + direction.y * 5,
      position[2] + direction.z * 5
    ]
    
    return (
      <mesh position={midPosition} ref={position === leftPosition ? leftBeamRef : rightBeamRef}>
        <cylinderGeometry 
          args={[width * scale, width * 1.8 * scale, 10, 16, 4, true]} 
          rotation={[Math.PI/2, 0, 0]}
        />
        <meshBasicMaterial
          color={color}
          transparent={true}
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    )
  }
  
  // Composant pour l'effet de halo autour des phares
  const Glow = ({ position, scale, color }: any) => {
    return (
      <sprite position={position} scale={[scale * 2, scale * 2, 1]}>
        <spriteMaterial
          map={null}
          color={color}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    )
  }
  
  return (
    <>
      {/* Phare gauche */}
      <SpotLight
        ref={leftLightRef}
        position={leftPosition}
        castShadow={castShadow}
        penumbra={penumbra}
        distance={distance}
        angle={angle}
        attenuation={attenuation}
        anglePower={anglePower}
        intensity={currentIntensity}
        color={color}
        target={leftTargetRef.current || undefined}
        visible={isOn} // Rendre invisible quand éteint
      />
      <object3D ref={leftTargetRef} position={leftTargetPos} />
      
      {/* Phare droit */}
      <SpotLight
        ref={rightLightRef}
        position={rightPosition}
        castShadow={castShadow}
        penumbra={penumbra}
        distance={distance}
        angle={angle}
        attenuation={attenuation}
        anglePower={anglePower}
        intensity={currentIntensity}
        color={color}
        target={rightTargetRef.current || undefined}
        visible={isOn} // Rendre invisible quand éteint
      />
      <object3D ref={rightTargetRef} position={rightTargetPos} />
      
      {/* Effets volumétriques pour les faisceaux lumineux - uniquement si isOn est true */}
      {isOn && volumetric && (
        <>
          <VolumetricBeam 
            position={leftPosition} 
            direction={leftDirection} 
            width={volumetricWidth} 
            color={color} 
          />
          <VolumetricBeam 
            position={rightPosition} 
            direction={rightDirection} 
            width={volumetricWidth} 
            color={color} 
          />
        </>
      )}
      
      {/* Ampoules émissives et halos - uniquement si isOn est true */}
      {(isOn || currentIntensity > 0.01) && (
        <>
          {/* Ampoules */}
          <mesh position={leftPosition}>
            <sphereGeometry args={[0.1 * scale, 16, 16]} />
            <meshBasicMaterial color={color} opacity={currentIntensity/intensity} transparent />
          </mesh>
          <mesh position={rightPosition}>
            <sphereGeometry args={[0.1 * scale, 16, 16]} />
            <meshBasicMaterial color={color} opacity={currentIntensity/intensity} transparent />
          </mesh>
          
          {/* Halos lumineux */}
          {glow && (
            <>
              <Glow position={leftPosition} scale={0.3 * scale} color={color} />
              <Glow position={rightPosition} scale={0.3 * scale} color={color} />
              
              {/* Points de lumière additionnels pour l'effet de diffusion */}
              <pointLight position={leftPosition} intensity={currentIntensity * 0.4} color={color} distance={2} />
              <pointLight position={rightPosition} intensity={currentIntensity * 0.4} color={color} distance={2} />
            </>
          )}
        </>
      )}
    </>
  )
}
