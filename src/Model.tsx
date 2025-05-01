import { useGLTF } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

useGLTF.preload("assets/porsche.glb")

export default function Model({ 
    scrollProgress = 0, 
    animations = { rotation: 0, position: { x: 0, y: 0, z: 0 }, scale: 1, zoom: 0 },
    currentSection = 0,
    receiveShadow = false 
}: { 
    scrollProgress?: number, 
    animations?: { 
        rotation: number;
        position: { x: number; y: number; z: number };
        scale: number;
        zoom: number;
    },
    currentSection?: number,
    receiveShadow?: boolean 
}) {
    const group = useRef<any>(null)
    const { nodes, materials, scene } = useGLTF("assets/porsche.glb")

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
            
            // Animations spécifiques à chaque section
            switch(currentSection) {
                case 0:
                    // Animation pour la section d'accueil (rotation simple)
                    break;
                case 1:
                    // Animation pour montrer un côté spécifique de la voiture
                    group.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.05;
                    break;
                case 2:
                    // Animation pour montrer l'intérieur/détails
                    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
                    break;
                case 3:
                    // Animation finale
                    group.current.rotation.x = Math.cos(state.clock.elapsedTime) * 0.1;
                    break;
                default:
                    break;
            }
        }
    })

    return(
        <group ref={group} >
            <primitive object={scene}/>
        </group>
    )
}