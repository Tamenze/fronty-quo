import './RootLayout.css'
import { getCsrf } from './api/client';
import { useEffect } from 'react';
import { useFetchCurrentUser } from './features/users/hooks/useFetchCurrentUser';

import NavBar from './features/NavBar';
import Footer from './features/Footer';
import { Outlet } from "react-router-dom";
import Logo from '@/assets/logo.svg?react';

function RootLayout() {
  const { data: currentUser, isLoading } = useFetchCurrentUser();

  useEffect(() => {
    getCsrf().catch(console.error);
  }, []);

  useEffect(() => {
    console.log({isLoading})
  }, [isLoading]);


  return (
    <div className="min-h-svh w-5/6 m-auto bg-background text-foreground flex flex-col">
      <header className="w-full bg-background flex-col">
        <Logo aria-hidden focusable="false" viewBox="350 58 500 460" className="h-[150px] w-auto justify-self-center" />
        <NavBar currentUser={currentUser} isLoadingAuth={isLoading} />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default RootLayout
