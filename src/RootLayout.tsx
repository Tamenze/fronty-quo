// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './RootLayout.css'
import { getCsrf } from './api/client';
import { useEffect } from 'react';
import { useFetchCurrentUser } from './features/users/hooks/useFetchCurrentUser';

import NavBar from './features/NavBar';
import Footer from './features/Footer';
import { Outlet } from "react-router-dom"


function RootLayout() {
  const { data: currentUser } = useFetchCurrentUser()

  useEffect(() => {
    getCsrf().catch(console.error);
  }, []);


  return (
    <>
      <NavBar currentUser={currentUser}/>
      <Outlet />
      <Footer/>
    </>
  )
}

export default RootLayout
