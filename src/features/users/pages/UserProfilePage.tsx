// import { useFetchSpecificUser } from "../hooks/useFetchSpecificUser"
// import { useFetchCurrentUser } from "../hooks/useFetchCurrentUser"
// import { useParams, Link } from "react-router-dom"
// import { usePageTitle } from "../../../shared/hooks/usePageTitle"
// import { useEffect } from "react"
// import QuotesList from "../../quotes/components/QuotesList"
// import TagCard from "../../tags/components/TagCard"


// // show user info, their created quotes, their created tags 
// // show button for deleting self (show confirmation page that quotes will remain, if they want to delete all quotes they should do that first)
// //button for deleting all quotes 


// function UserProfilePage(){
//   const { id } = useParams<{id: string}>()
//   const { data: currentUser } = useFetchCurrentUser()

//   const {data: user, isPending, isError, error} = useFetchSpecificUser(Number(id)) 
//   //why is this pending if the user is logged out? 

//   useEffect(() => console.log(user), [user])
  
//   const isMyProfile = user?.id === currentUser?.id;
//   usePageTitle(`Profile: ${user?.username}`)


//   if (isPending) return <p>Loading…</p>;
//   if (isError)   return <p role="alert">Error: {error?.message}</p>;
//   if (!user)  return <p>No user found.</p>;
//   //tk make this into a component or hook that renders below page title 

//   return (
//     <>
//       <h1> {isMyProfile ? "My": "User"} Profile Page </h1>
//       { isMyProfile && (
//         <Link to={`/users/${currentUser?.id}/edit`}>Edit my profile</Link>
//       )}
//       { user && (
//         <>
//           <h2> Email: {user.email} </h2>
//           <h2> Username: {user.username} </h2>
//           {user.quotes && (
//             <>
//               <h2>Created Quotes:</h2>
//               <QuotesList quotes={user.quotes} />
//             </>
//           )}
//           {user.created_tags && (
//             <>
//               <h2> Created Tags: </h2>
//               {user.created_tags.map((t, ind) => <p><Link to={`/tags/${t.id}`} key={`tag-${ind}`}>{t.name}</Link></p>)}
//             </>
//           )}
//         </>
//       )}
//     </>
//   )
// }

// export default UserProfilePage


import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useFetchSpecificUser } from "../hooks/useFetchSpecificUser";
import { useFetchCurrentUser } from "../hooks/useFetchCurrentUser";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import QuotesList from "../../quotes/components/QuotesList";

export const UserProfilePageSkeleton = () => (
  <div className="p-4 sm:p-6" aria-hidden>
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-28" />
      </div>
      <Separator />
      <div className="grid gap-3">
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Separator />
      <div className="grid gap-2">
        <Skeleton className="h-5 w-32" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
      </div>
    </Card>
  </div>
)

function UserProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: currentUser } = useFetchCurrentUser();

  const {
    data: user,
    isPending,
    isError,
    error,
  } = useFetchSpecificUser(Number(id));

  useEffect(() => {
    // dev-only peek
    console.log(user);
  }, [user]);

  const isMyProfile = !!user && !!currentUser && user.id === currentUser.id;

  usePageTitle(user ? `Profile: ${user.username}` : "Profile");

  if (isPending) return <UserProfilePageSkeleton/>

  if (isError) {
    return (
      <div className="p-4 sm:p-6">
        <Alert variant="destructive">
          <AlertTitle>Couldn't load profile</AlertTitle>
          <AlertDescription>{error?.message ?? "Something went wrong."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 sm:p-6">
        <Alert>
          <AlertTitle>No user found</AlertTitle>
          <AlertDescription>The user you're looking for doesn't seem to exist.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <Card className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">
              {isMyProfile ? "My Profile" : `User Profile for ${user.username}`}
            </h1>
            <p className="text-sm text-muted-foreground">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>

          {isMyProfile && (
            <Button onClick={() => navigate(`/users/${user.id}/edit`)}>Edit profile</Button>
          )}
        </div>

        <Separator />

        {/* Basic info */}
        <div className="grid gap-2">
          <div className="text-sm text-muted-foreground">Email</div>
          <div className="text-base">{user.email}</div>

          <div className="text-sm text-muted-foreground mt-4">Username</div>
          <div className="text-base">{user.username}</div>
        </div>

        {/* Quotes */}
        {user.quotes && user.quotes.length > 0 && (
          <>
            <Separator />
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Created Quotes</CardTitle>
              <CardDescription>All quotes quoted by {user.username}.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <QuotesList quotes={user.quotes} />
            </CardContent>
          </>
        )}

        {/* Tags */}
        {user.created_tags && user.created_tags.length > 0 && (
          <>
            <Separator />
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg">Created Tags</CardTitle>
              <CardDescription>All tags created by {user.username}.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="flex flex-wrap gap-2">
                {user.created_tags.map((t) => (
                  <Badge key={t.id} variant="secondary" asChild>
                    <Link to={`/tags/${t.id}`}>{t.name}</Link>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

export default UserProfilePage;
