import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from './users/hooks/useLogout';
import { type User } from "../types/index"

type NavBarProps = {
  currentUser: User | null | undefined;
}

function NavBar({ currentUser }: NavBarProps){
  const navigate = useNavigate();
  const location = useLocation();


  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const isOn = (path: string) => location.pathname === path;
  
  const showHomeButton = isOn('/signup') || isOn('/login');
  const loggedIn = !!currentUser;

  return (
    <nav>
      {loggedIn ? (
        <>
          <button 
            onClick={() => logout()} 
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </button>
          <button 
            onClick={() => navigate('/quotes/new')} 
            disabled={isOn('/quotes/new')}
          >
            Add a new Quote 
          </button>
          <button 
            onClick={() => navigate('/tags/new')}
            disabled={isOn('/tags/new')}
          >
            Add a new Tag
          </button>
          <button 
            onClick={() => navigate('/quotes')}
            disabled={isOn('/quotes')}
          >
            See all Quotes 
          </button>
          <button 
            onClick={() => navigate(`/users/${currentUser.id}`)}
            disabled={isOn(`/users/${currentUser.id}`)}
          >
            My Profile 
          </button>
        </>
      ):(
      <>
        <button 
          onClick={() => navigate('/signup')}
          disabled={isOn('/signup')}
        >
          Sign Up
        </button>
        <button 
          onClick={() => navigate('/login')} 
          disabled={isOn('/login')}
        >
          Log In
        </button>
        {showHomeButton && (
          <button
            onClick={() => navigate('/')} 
          >
            Home
        </button>
        )}
      </>
      )}
    </nav>
  )
}

export default NavBar
