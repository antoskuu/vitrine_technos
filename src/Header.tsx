import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
  } from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import './Header.css'
import { useEffect, useRef } from 'react'
// Ajout des imports pour le bouton et l'icône Home
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

function Header() {
    const headerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                const { top } = headerRef.current.getBoundingClientRect();
                if (top <= 0) {
                    headerRef.current.classList.add('is-sticky');
                } else {
                    headerRef.current.classList.remove('is-sticky');
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        // Vérification initiale
        handleScroll();
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    return (
        <div className="header-blur" ref={headerRef}>
          <div className="w-full navigation-menu-container justify-between">
            {/* Logo Home à gauche */}
            <Link to="/" className="mr-4 flex-shrink-0">
              <Button variant="ghost" size="icon" aria-label="Accueil">
                <Home className="w-6 h-6" />
              </Button>
            </Link>
            {/* Menu de navigation centré */}
            <div className="flex-1 flex justify-center">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                      Nos restaurants
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="flex flex-col gap-2 p-2">
                        <li>
                          <Link to="/docs">
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                              Reims
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li>
                          <Link to="/about">
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                              Lille
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li>
                          <Link to="/docs">
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                              Lyon
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/*/Deuxième dropdown menu*/}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                      Plus
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="flex flex-col gap-2 p-2">
                        <li>
                          <Link to="/docs">
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                              Documentation
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li>
                          <Link to="/about">
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                              À propos
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                    <NavigationMenuItem>
                      <Link to="/porsche">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          Rendu 3d
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>

                  {/*/Premier dropdown menu*/}
                    
                  <NavigationMenuItem>
                      <Link to="/websocket">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          Web Sockets
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
    )
}
  
export default Header


