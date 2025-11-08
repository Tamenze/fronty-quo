import { Link, useParams, useNavigate } from "react-router-dom";
import { useFetchSpecificUser } from "../hooks/useFetchSpecificUser";
import { useFetchCurrentUser } from "../hooks/useFetchCurrentUser";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import { useSearchParams } from "react-router-dom";
import { useRef, useEffect } from "react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorNotice from "@/features/ErrorNotice";
import MissingItemNotice from "@/features/MissingItemNotice";
import QuotesList from "../../quotes/components/QuotesList";
import PaginationBar from "@/features/PaginationBar";


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
  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get("page") || 1);
  const perPage = Number(sp.get("per_page") || 10);

  const listRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef<number | null>(null);


  const { data: currentUser } = useFetchCurrentUser();
  const { 
    data: { user, pagination } = {}, 
    isPending, 
    isError, 
    error 
  } = useFetchSpecificUser(Number(id), page, perPage)
  const lastPage = pagination?.last ?? 1;

  usePageTitle(user ? `Profile: ${user.username}` : "Profile");
  const isMyProfile = !!user && !!currentUser && user.id === currentUser.id;



  const onPageChange = (newPage: number) => {
    setSp({ page: String(newPage), per_page: String(perPage) }, { replace: false });
  };

  useEffect(() => {
    const isFirstRender = prevPageRef.current === null;
    const pageChanged = prevPageRef.current !== page;

    if (!isPending && pageChanged && !isFirstRender) {
      listRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
    }
    prevPageRef.current = page;
  }, [page, isPending]);

  if (isPending) return <UserProfilePageSkeleton/>
  if (isError) return <ErrorNotice title="Couldn't load profile" error={error} />
  if (!user) return <MissingItemNotice resourceName="user"/>

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
            <CardHeader className="px-0 pt-0" ref={listRef}>
              <CardTitle className="text-lg">Created Quotes</CardTitle>
              <CardDescription>All quotes quoted by {user.username}.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <QuotesList quotes={user.quotes} />
            </CardContent>
              {(pagination && pagination.count > pagination.limit) && (
                <PaginationBar 
                    page={page}
                    lastPage={lastPage}
                    onPageChange={onPageChange}
                />
              )}
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
