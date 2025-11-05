import { useLocation, Link } from 'react-router-dom';
import { useLogout } from './users/hooks/useLogout';
import { type User } from "../types/index"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Bye from '@/assets/bye.svg?react';
import { Skeleton } from "@/components/ui/skeleton";


type NavBarProps = {
  currentUser: User | null | undefined;
  isLoadingAuth: boolean;
}

const NavBarSkeleton = () => {
  return (
    <NavigationMenu className='m-auto justify-between p-10 pt-0'>
        <NavigationMenuList>
          <div className="flex items-center gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 rounded w-24" />
            ))}
          </div>
        </NavigationMenuList>
    </NavigationMenu>
  )
}

function NavBar({ currentUser, isLoadingAuth }: NavBarProps){
  const location = useLocation();


  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const isOn = (path: string) => location.pathname === path;

  const showHomeLink = isOn('/signup') || isOn('/login');
  const loggedIn = !!currentUser;

  if (isLoadingAuth) return <NavBarSkeleton />

  return (
        <NavigationMenu className='m-auto justify-between p-10 pt-0 **:text-lg'>
          <NavigationMenuList>
          {loggedIn ? (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to={'/quotes/new'}>Add a new Quote</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to={'/tags/new'}>Add a new Tag</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to={'/quotes'}>See all Quotes</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to={`/users/${currentUser.id}`}>My Profile</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button 
                    variant="ghost"
                    onClick={() => logout()} 
                    disabled={isLoggingOut}
                    className="inline-flex flex-row! items-center gap-2 whitespace-nowrap"
                  >
                    <Bye aria-hidden focusable="false" className="h-5 w-5 inline-block shrink-0 align-middle"/>
                    <span className="leading-none font-normal">{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          ):(
          <>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to={'/signup'}>Sign Up</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to={'/login'}>Log In</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {showHomeLink && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to={'/'}>Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </>
          )}
          </NavigationMenuList>
        </NavigationMenu>
  )
}

export default NavBar
