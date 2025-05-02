import { useState, useEffect, Suspense } from "react";

import Scene from "../Scene";

export function Three() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentSection, setCurrentSection] = useState(0);
    const [sectionProgress, setSectionProgress] = useState(0);
    const [sectionAnimations, setSectionAnimations] = useState({
        rotation: Math.PI / 3,
        rotationX: 0,
        rotationY: 0,
        position: { x: 0, y: 0, z: 0 },
        scale: 5,
        zoom: 2,
        cameraPosition: [0, 5, 10] as [number, number, number],
        cameraRotation: [-Math.PI/6, 0, 0] as [number, number, number],
      });

    const sectionStates = [
        {
          rotation: Math.PI / 3,
          rotationX: 0,
          rotationY: 0,
          position: { x: 0, y: 0, z: -6 },
          scale: 2.7,
          zoom: 0,
          cameraPosition: [0, 5, 10] as [number, number, number],
          cameraRotation: [-Math.PI/6, 0, 0] as [number, number, number],
        },
        {
          rotation: 0,
          rotationX: 0,
          rotationY: 0,
          position: { x: 0, y: 3, z: -3 },
          scale: 3,
          zoom: 0,
          cameraPosition: [0, 5, 10] as [number, number, number],
          cameraRotation: [-Math.PI/6, 0, 0] as [number, number, number],
        },
        {
          rotation:-Math.PI/2,
          rotationX: 0,
          rotationY: 0,
          position: { x: 3, y: 0.5, z: 0 },
          scale: 1.5,
          zoom: 0,
          cameraPosition: [0, 5, 10] as [number, number, number],
          cameraRotation: [-Math.PI/6, 0, 0] as [number, number, number],
        },
        {
          rotation: 0,
          rotationX: 0,
          rotationY: 0,
          position: { x: 0, y: 1, z: 0 },
          scale: 0.3,
          zoom: 0,
          cameraPosition: [0, 10, 1] as [number, number, number],
          cameraRotation: [-2*Math.PI/4, 0, 0] as [number, number, number],
        },
    ];

    function lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
    }
    
    function lerpState(a: any, b: any, t: number) {
        return {
            rotation: lerp(a.rotation, b.rotation, t),
            rotationX: lerp(a.rotationX || 0, b.rotationX || 0, t),
            rotationY: lerp(a.rotationY || 0, b.rotationY || 0, t),
            position: {
                x: lerp(a.position.x, b.position.x, t),
                y: lerp(a.position.y, b.position.y, t),
                z: lerp(a.position.z, b.position.z, t),
            },
            scale: lerp(a.scale, b.scale, t),
            zoom: lerp(a.zoom, b.zoom, t),
            cameraPosition: [
                lerp(a.cameraPosition[0], b.cameraPosition[0], t),
                lerp(a.cameraPosition[1], b.cameraPosition[1], t),
                lerp(a.cameraPosition[2], b.cameraPosition[2], t),
            ] as [number, number, number],
            cameraRotation: [
                lerp(a.cameraRotation[0], b.cameraRotation[0], t),
                lerp(a.cameraRotation[1], b.cameraRotation[1], t),
                lerp(a.cameraRotation[2], b.cameraRotation[2], t),
            ] as [number, number, number],
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
                const section = sections[i] as HTMLElement;
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                    foundSection = i;
                    foundProgress = Math.min(Math.max((scrollTop - sectionTop) / sectionHeight, 0), 1);
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

    // Utiliser GSAP pour des animations plus fluides lors du changement de section
    useEffect(() => {
        const fromState = sectionStates[currentSection];
        const toState = sectionStates[currentSection + 1] || sectionStates[currentSection];
        const interpolated = lerpState(fromState, toState, sectionProgress);
        setSectionAnimations(interpolated);
        
    }, [currentSection, sectionProgress]);

    return (
        <main className="overflow-x-hidden">
          {/* Indicateur de section */}
         {/*  <div className="fixed top-4 right-4 z-50 bg-black/50 text-white px-4 py-2 rounded-lg">
            <div>Section: {currentSection + 1}/{sectionStates.length}</div>
            <div>Progression: {Math.round(sectionProgress * 100)}%</div>
          </div> */}
          
          <div className="fixed inset-0 z-10 pointer-events-none">
            <div className="h-full w-full">
              <Scene 
                scrollProgress={scrollProgress} 
                animations={sectionAnimations}
                currentSection={currentSection}
                // On ne transmet pas extraScroll car on veut contrôler les phares uniquement via la section
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
            {/* Le reste du code avec vos sections */}
            <section className="relative grid place-items-center h-[100vh] z-0">
  <div className="absolute top-[5%] mx-4">
    <p
      className="text-8xl font-bold 
        backdrop-blur-sm bg-white/0 border border-white/0 
        rounded-xl px-8 py-4
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.6)]
        transition-all duration-300
        luminous-text"
      style={{ position: "relative" }}
    >
      <span className="text-glow-porsche animate-glow" style={{ fontFamily: "'Mollani-Regular', sans-serif" }}>Porsche</span>
      <span className="text-glow-porsche animate-glow" style={{ fontFamily: "'Caliste', 'Caliste-Regular', Caliste, sans-serif" }}> 911</span>
    </p>
  </div>
</section>
            
            <section className="relative flex items-center justify-evenly h-[100vh] z-0">
              <p className="w-[50%] border-0 border-red-700"></p>
    
              <p className="w-[50%] text-center px-4 text-4xl font-semibold">
                La Porsche 911 incarne l’équilibre parfait entre élégance intemporelle et performances de pointe. 
              </p>
            </section>
    
            <section className="relative flex items-center justify-evenly h-[100vh] z-0">
              <p className="order-1 w-[50%] text-center px-4 text-4xl font-semibold">
                Son moteur six cylindres à plat délivre une puissance saisissante, offrant des sensations de conduite uniques et une réactivité instantanée à chaque accélération.
              </p>
              <p className="w-[50%] order-2"></p>
            </section>
    
            <section className="relative flex items-center justify-evenly h-[100vh] z-0">
              <p className="w-[50%] border-0 border-red-700"></p>
    
              <p className="w-[50%] text-center px-4 text-4xl font-semibold">
                Les phares LED de la 911 illuminent la route avec une puissance et une précision remarquables, garantissant une visibilité optimale même dans les conditions les plus exigeantes.
              </p>
            </section>
          </Suspense>
        </main>
      );
}

export default Three;