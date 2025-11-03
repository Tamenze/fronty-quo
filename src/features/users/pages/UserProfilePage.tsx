import { useFetchSpecificUser } from "../hooks/useFetchSpecificUser"
import { useFetchCurrentUser } from "../hooks/useFetchCurrentUser"
import { useParams, Link } from "react-router-dom"
import { usePageTitle } from "../../../shared/hooks/usePageTitle"
import { useEffect } from "react"
import QuotesList from "../../quotes/components/QuotesList"
import TagCard from "../../tags/components/TagCard"


// show user info, their created quotes, their created tags 
// show button for deleting self (show confirmation page that quotes will remain, if they want to delete all quotes they should do that first)
//button for deleting all quotes 


function UserProfilePage(){
  const { id } = useParams<{id: string}>()
  const { data: currentUser } = useFetchCurrentUser()

  const {data: user, isPending, isError, error} = useFetchSpecificUser(Number(id)) 
  //why is this pending if the user is logged out? 

  useEffect(() => console.log(user), [user])
  
  const isMyProfile = user?.id === currentUser?.id;
  usePageTitle(`Profile: ${user?.username}`)


  if (isPending) return <p>Loading…</p>;
  if (isError)   return <p role="alert">Error: {error?.message}</p>;
  if (!user)  return <p>No user found.</p>;
  //tk make this into a component or hook that renders below page title 

  return (
    <>
      <h1> {isMyProfile ? "My": "User"} Profile Page </h1>
      { isMyProfile && (
        <Link to={`/users/${currentUser?.id}/edit`}>Edit my profile</Link>
      )}
      { user && (
        <>
          <h2> Email: {user.email} </h2>
          <h2> Username: {user.username} </h2>
          {user.quotes && (
            <>
              <h2>Created Quotes:</h2>
              <QuotesList quotes={user.quotes} />
            </>
          )}
          {user.created_tags && (
            <>
              <h2> Created Tags: </h2>
              {user.created_tags.map((t, ind) => <p><Link to={`/tags/${t.id}`} key={`tag-${ind}`}>{t.name}</Link></p>)}
            </>
          )}
        </>
      )}
    </>
  )
}

export default UserProfilePage


