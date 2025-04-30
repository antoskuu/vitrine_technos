import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "./Scene";

gsap.registerPlugin(ScrollTrigger);

export function Three() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

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
        return () => {
            window.removeEventListener("scroll", handleScroll);
            // Clean up any GSAP animations to prevent memory leaks
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            gsap.globalTimeline.clear();
        };
    }, []);
    
    return (
        <main className="overflow-x-hidden">
          {/* Scène 3D en fixed */}
          <div className="fixed inset-0 z-10 pointer-events-none">
            <div className="h-full w-full">
              <Scene scrollProgress={scrollProgress} />
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
              <p className="text-center absolute bottom-[5%] mx-4 w-fit text-8xl font-bold">
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