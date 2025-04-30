import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle
    
  } from "@/components/ui/navigation-menu"
  
import { Link } from "react-router-dom"
import './Header.css'
import { useEffect, useRef } from 'react'

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
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Accueil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

            {/*/Premier dropdown menu*/}
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
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Accueil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          {/* Affiche le viewport animé pour le contenu du menu */}
          </NavigationMenu>
        </div>
    )
}
  
export default Header


