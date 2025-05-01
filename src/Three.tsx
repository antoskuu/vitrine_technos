import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import Scene from "./Scene";

/*
Explications des propriétés d'animation 3D :

- rotation : Angle de rotation du modèle (autour d'un axe, souvent l'axe Y ou Z). Exprimé en radians.
- rotationX : Angle de rotation du modèle autour de l'axe X. Exprimé en radians.
- rotationY : Angle de rotation du modèle autour de l'axe Y. Exprimé en radians.
- position.x, position.y, position.z : Position du modèle dans l'espace 3D (axes X, Y, Z).
    - x : déplacement gauche/droite
    - y : déplacement haut/bas
    - z : déplacement avant/arrière (profondeur)
- scale : Facteur d'échelle du modèle (1 = taille normale, 2 = deux fois plus grand, etc.).
- zoom : Facteur de zoom de la caméra (plus la valeur est grande, plus la caméra "zoome" sur le modèle).

Ces valeurs sont interpolées pour animer la transition du modèle 3D lors du scroll.
*/

export function Three() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentSection, setCurrentSection] = useState(0);
    const [sectionProgress, setSectionProgress] = useState(0);
    const [sectionAnimations, setSectionAnimations] = useState({
        rotation: -Math.PI / 3,
        rotationX: 0,
        rotationY: 0,
        position: { x: 5, y: 5, z: 0 },
        scale: 1,
        zoom: 0,
    });

    const sectionStates = [
        {
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            position: { x: 2, y: 0, z: -1 },
            scale: 1.3,
            zoom: 0,
        },
        {
            rotation: Math.PI / 3,
            rotationX: Math.PI / 2,
            rotationY: Math.PI / 4,
            position: { x: -1, y: 0.5, z: -3 },
            scale: 0.8,
            zoom: 0,
        },
        {
            rotation: -Math.PI / 2,
            rotationX: -Math.PI / 8,
            rotationY: Math.PI / 2,
            position: { x: 3, y: 0.5, z: 0 },
            scale: 0.7,
            zoom: 0,
        },
        {
            rotation: Math.PI,
            rotationX: -Math.PI / 2,
            rotationY: Math.PI,
            position: { x: 0, y: 1, z: 0 },
            scale: 0.5,
            zoom: 0,
        },
    ];

    function lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
    }
    function lerpState(a: any, b: any, t: number) {
        return {
            rotation: lerp(a.rotation, b.rotation, t),
            rotationX: lerp(a.rotationX, b.rotationX, t),
            rotationY: lerp(a.rotationY, b.rotationY, t),
            position: {
                x: lerp(a.position.x, b.position.x, t),
                y: lerp(a.position.y, b.position.y, t),
                z: lerp(a.position.z, b.position.z, t),
            },
            scale: lerp(a.scale, b.scale, t),
            zoom: lerp(a.zoom, b.zoom, t),
        };
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? scrollTop / docHeight : 0;
            setScrollProgress(progress);

            const sections = document.querySelectorAll('section');
            let foundSection = 0;
            let foundProgress = 0;
            for (let i = 0; i < sections.length; i++) {
                const rect = sections[i].getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                    foundSection = i;
                    const sectionHeight = rect.height;
                    foundProgress = Math.min(Math.max((window.innerHeight / 2 - rect.top) / sectionHeight, 0), 1);
                    break;
                }
            }
            setCurrentSection(foundSection);
            setSectionProgress(foundProgress);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const fromState = sectionStates[currentSection];
        const toState = sectionStates[currentSection + 1] || sectionStates[currentSection];
        const interpolated = lerpState(fromState, toState, sectionProgress);
        setSectionAnimations(interpolated);
    }, [currentSection, sectionProgress]);

    return (
        <main className="overflow-x-hidden">
          <div className="fixed inset-0 z-10 pointer-events-none">
            <div className="h-full w-full">
              <Scene 
                scrollProgress={scrollProgress} 
                animations={sectionAnimations}
                currentSection={currentSection}
              />
            </div>
          </div>
          <Suspense
            fallback={
              <div className="fixed inset-0 grid place-items-center bg-black text-white">
                <div className="flex flex-col items-center">
                  <div className="mb-4 h-8 w-8 animate-spin rounded-full border-t-2 border-white"></div>
                  <p>Loading 3D Model...</p>
                </div>
              </div>
            }
          >
            <section className="relative grid place-items-center h-[100vh] z-0">
              <p className="text-center absolute top-[5%] mx-4 w-fit text-8xl font-bold">
                Porsche
              </p>
              <p className="text-center absolute  mx-4 w-fit text-8xl font-bold">
                911
              </p>
            </section>
            
            <section className="relative flex items-center justify-evenly h-[100vh] z-0">
              <p className="w-[50%] border-0 border-red-700"></p>
    
              <p className="w-[50%] text-center px-4 text-4xl font-semibold">
                Effortlessly scroll, zoom, and navigate with the re-engineered
                Digital Crown, now more precise than ever.
              </p>
            </section>
    
            <section className="relative flex items-center justify-evenly h-[100vh] z-0">
              <p className="order-1 w-[50%] text-center px-4 text-4xl font-semibold">
                Built for adventure, the rugged straps are as tough as you are,
                ready for any challenge.
              </p>
              <p className="w-[50%] order-2"></p>
            </section>
    
            <section className="relative flex items-center justify-evenly h-[100vh] z-0">
              <p className="w-[50%] border-0 border-red-700"></p>
    
              <p className="w-[50%] text-center px-4 text-4xl font-semibold">
                The brightest display ever on an Apple Watch, so you can see it
                clearly even under the harshest sun.
              </p>
            </section>
          </Suspense>
        </main>
      );
}

export default Three;