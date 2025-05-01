import { useGLTF } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import Headlights from "./Headlights"

useGLTF.preload("assets/porsche.glb")

export default function Model({ 
    scrollProgress = 0, 
    animations = { rotation: 0, rotationX: 0, position: { x: 0, y: 0, z: 0 }, scale: 1, zoom: 0 },
    currentSection = 0,
    receiveShadow = false,
    headlightsOn = true
}: { 
    scrollProgress?: number, 
    animations?: { 
        rotation: number;
        rotationX: number;
        position: { x: number; y: number; z: number };
        scale: number;
        zoom: number;
    },
    currentSection?: number,
    receiveShadow?: boolean,
    headlightsOn?: boolean
}) {
    const group = useRef<any>(null)
    const { nodes, materials, scene } = useGLTF("assets/porsche.glb")
    
    // Configuration précise des phares pour la Porsche
    const headlightConfig = {
        // Position relative à l'avant de la voiture
        leftPosition: [0.9, 0.5, 2.4], // X (gauche/droite), Y (haut/bas), Z (avant/arrière) 
        rightPosition: [-0.9, 0.5, 2.4],
        // Ajuster ces valeurs selon la géométrie exacte de votre modèle
        angle: 0.25,
        intensity: 3.5,
        color: "#f9f1c2",
        distance: 25
    }
    
    useFrame((state) => {
        if (group.current) {
            // Application des animations spécifiques à la section
            group.current.rotation.y = animations.rotation;
            group.current.position.x = animations.position.x;
            group.current.position.y = animations.position.y;
            group.current.position.z = animations.position.z;
            
            const scale = animations.scale;
            group.current.scale.set(scale, scale, scale);
            
            // Ajustement de la caméra si nécessaire
            if (animations.zoom > 0) {
                state.camera.zoom = 1 + animations.zoom;
                state.camera.updateProjectionMatrix();
            }
        }
    })
    
    return(
        <group ref={group}>
            {/* Le modèle 3D de la Porsche */}
            <primitive object={scene}/>
            
            {/* Phares intégrés directement dans le groupe du modèle */}
            <Headlights 
                // Position zéro car les phares sont maintenant enfants du groupe
                position={[0, 0, 0]} 
                // Échelle relative au modèle (pas besoin de multiplier par animations.scale)
                scale={0.4} 
                // Paramètres des phares
                intensity={0}
                color={headlightConfig.color}
                angle={headlightConfig.angle}
                penumbra={1}
                distance={headlightConfig.distance}
                attenuation={2}
                anglePower={0}
                isOn={headlightsOn}
                volumetric={false}
                volumetricWidth={0.5}
                glow={true}
                // Positions personnalisées pour correspondre exactement à l'emplacement des phares
                customLeftPosition={headlightConfig.leftPosition as [number, number, number]}
                customRightPosition={headlightConfig.rightPosition as [number, number, number]}
                // Direction des faisceaux (légèrement vers l'avant et vers le bas)
                beamDirection={[0, -0.15, 10]}
            />
        </group>
    )
}