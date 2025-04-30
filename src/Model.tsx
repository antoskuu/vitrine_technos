import { useGLTF } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

useGLTF.preload("assets/porsche.glb")

export default function Model({ scrollProgress = 0, receiveShadow }: { scrollProgress?: number, receiveShadow?: boolean }) {
    const group = useRef<any>(null)
    const { nodes, materials, scene } = useGLTF("assets/porsche.glb")

    useFrame(() => {
        if (group.current) {
            // scrollProgress va de 0 à 1 selon le scroll global de la page
            group.current.rotation.y = scrollProgress * Math.PI * 2
            // Tu peux aussi animer la position, l'échelle, etc.
        }
    })

    return(
        <group ref={group} >
            <primitive object={scene}/>
        </group>
    )
}