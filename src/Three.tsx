import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "./Scene";

gsap.registerPlugin(ScrollTrigger);

export function Three() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    // Ajout d'un état pour suivre la section actuelle
    const [currentSection, setCurrentSection] = useState(0);
    // État pour les animations spécifiques à chaque section
    const [sectionAnimations, setSectionAnimations] = useState({
        rotation: 0,
        position: { x: 0, y: 0, z: 0 },
        scale: 1,
        zoom: 0,
    });

    // Ajout du scroll global
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? scrollTop / docHeight : 0;
            setScrollProgress(progress);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        
        // Création des triggers pour chaque section
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => setCurrentSection(index),
                onEnterBack: () => setCurrentSection(index),
            });
        });
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            // Clean up any GSAP animations to prevent memory leaks
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            gsap.globalTimeline.clear();
        };
    }, []);
    
    // Effet pour gérer les animations spécifiques à chaque section
    useEffect(() => {
        // Définir des animations différentes selon la section active
        switch(currentSection) {
            case 0: // Première section
                setSectionAnimations({
                    rotation: scrollProgress * Math.PI * 2,
                    position: { x: 0, y: 0, z: 0 },
                    scale: 1,
                    zoom: 0
                });
                break;
            case 1: // Deuxième section
                setSectionAnimations({
                    rotation: Math.PI / 2 + (scrollProgress * Math.PI / 2),
                    position: { x: scrollProgress * 2, y: 0, z: 0 },
                    scale: 1 + scrollProgress * 0.2,
                    zoom: 0
                });
                break;
            case 2: // Troisième section
                setSectionAnimations({
                    rotation: Math.PI + (scrollProgress * Math.PI / 4),
                    position: { x: 0, y: scrollProgress * 1.5, z: 0 },
                    scale: 1.2 - scrollProgress * 0.1,
                    zoom: scrollProgress * 2
                });
                break;
            case 3: // Quatrième section
                setSectionAnimations({
                    rotation: Math.PI * 1.5 + (scrollProgress * Math.PI / 2),
                    position: { x: -scrollProgress * 2, y: 0, z: scrollProgress * 3 },
                    scale: 1 + scrollProgress * 0.5,
                    zoom: scrollProgress * 4
                });
                break;
            default:
                break;
        }
    }, [currentSection, scrollProgress]);
    
    return (
        <main className="overflow-x-hidden">
          {/* Scène 3D en fixed */}
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
            {/* Sections de contenu qui scrollent sous la scène */}
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