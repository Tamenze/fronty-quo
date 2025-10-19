
type NavBarProps = {
  logged_in: boolean

}

function NavBar({logged_in}: NavBarProps){
  return (
    <nav>
      {logged_in ? (
        <>
          <button> Log out</button>
          <button> Add a quote </button>
          <button> See all quotes </button>
        </>
      ):(
      <>
        <button> sign up </button>
        <button> log in </button>
      </>
      )}
    </nav>
  )
}

export default NavBar
