
// type QuoteCardProps = {
//   quote: Quote,
//   canEdit: boolean,
// }

// function QuoteCard({ quote, canEdit } : QuoteCardProps) {
//     const navigate = useNavigate();
//     const { mutate: deleteQuote, isPending: isDeletingQuote } = useDeleteQuote();
//     const [mutationError, setMutationError] = useState('');
    


//     useEffect(() => console.log(quote), [quote]);

//     const handleDelete = () => {
//       deleteQuote(quote.id, {
//         onSuccess: () => navigate('/quotes'),
//         onError: (err) => setMutationError(err.message)
//       })
//     }

//   return(
//     <div>
//       <p>{quote.body}</p> 
//       <p> <Link to={`/quotes/${quote.id}`}> {'>'} </Link> </p> 
//       {/* future: the above should only show on index page  */}
//       <p>Attribution: {quote.attribution}</p>
//       <p> 
//         <>Quoter:
//           {quote.user ? (
//              <Link to={`/users/${quote.user.id}`}> {quote.user.username} </Link>
//           ) : (
//             <span> User unknown </span>
//             // future: else link to page showing all user unknowns 
//           )}
//         </>
//       </p>
//       <p>Created at: {quote.created_at}</p>
//       {quote.tags?.map((t) => (
//         <span key={t.id}>
//           <Link to={`/tags/${t.id}`}> {t.name}</Link>
//           </span>
//       ))}

//       {canEdit && (
//         <>
//           <button onClick={() => navigate(`/quotes/${quote.id}/edit`)}> edit quote </button>
//           <button onClick={() => handleDelete()} disabled={isDeletingQuote}> {isDeletingQuote ? "deleting…" : "delete quote"} </button>
//         </>
//       )}
//       {mutationError && <p role="alert">{mutationError}</p>}


//       <hr/>
//     </div>
//   )
// }

// export default QuoteCard

import type { Quote } from "../../../types";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useDeleteQuote } from "../hooks/useDeleteQuote";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils"; 
import { Skeleton } from "@/components/ui/skeleton";


type QuoteCardProps = {
  quote: Quote;
  canEdit: boolean;
  className?: string;
  isWithinList?: boolean;
  isHero?: boolean;
  centerTags?: boolean;
};

export const QuoteCardSkeleton = ({className} : {className?: string}) => (
    <Card className={cn("p-4 m-auto w-10/12 mb-3 rounded-none first-of-type:rounded-t-xl last-of-type:rounded-b-xl", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold leading-snug space-y-3">
          {/* body (multi-line) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          {/* Attribution */}
          <div className="mt-4">
            <Skeleton className="h-4 w-48" />
          </div>
        </CardTitle>

        {/* CardDescription (quoted by • created …) only when !isHero in real component.
            We include a line to keep spacing consistent across list items. */}
        <CardDescription className="mt-2">
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Conditional separator if tags or canEdit exist; show it to reserve space */}
        <Skeleton className="h-px w-full" />
        {/* Tags row */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-2 pt-2 justify-between">
  
        <Skeleton className="h-9 w-28" />  {/* View details */}

        {/* Right-side edit/delete button group */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-16" />  {/* Edit */}
          <Skeleton className="h-9 w-20" />  {/* Delete */}
        </div>
      </CardFooter>

      {/* Mutation error reserve */}
      <Skeleton className="mt-2 h-4 w-64 opacity-0" />
    </Card>
)

export function QuoteCard({ quote, canEdit, className, isWithinList, isHero, centerTags }: QuoteCardProps) {
  const navigate = useNavigate();
  const { mutate: deleteQuote, isPending: isDeletingQuote } = useDeleteQuote();
  const [mutationError, setMutationError] = useState("");

  const createdAt = useMemo(() => {
    // future: swap for date-fns?
    try {
      return new Date(quote.created_at).toLocaleString();
    } catch {
      return quote.created_at;
    }
  }, [quote.created_at]);

  const handleDelete = () => {
    deleteQuote(quote.id, {
      onSuccess: () => navigate("/quotes"),
      onError: (err) => setMutationError(err.message),
    });
  };

  return (
    <Card className={cn("p-4 m-auto w-10/12 mb-3", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold leading-snug">
          {quote.body}
          {quote.attribution && (
          <p className="mt-4 text-sm text-muted-foreground">
            Attribution: <span className="text-foreground">{quote.attribution}</span>
          </p>
        )}
        </CardTitle>

        {!isHero && (
          <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
            <span>
              Quoted by{" "}
              {quote.user ? (
                <Link to={`/users/${quote.user.id}`} className="underline underline-offset-4">
                  {quote.user.username}
                </Link>
              ) : (
                <span className="text-muted-foreground">User unknown</span>
              )}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Created {createdAt}</span>
          </CardDescription>
        )}
      </CardHeader>

        <CardContent className="space-y-3">
          {/* Render separator conditionally */}
          {(!!quote.tags?.length || canEdit) && (
            <Separator />
          )}
          
          {!!quote.tags?.length && (
            <div 
              className={
                cn("flex flex-wrap gap-2", 
                  centerTags ? "justify-center" : "justify-start")
              }
            >
              {quote.tags.map((t) => (
                <Badge key={t.id} variant="secondary" className="hover:opacity-90">
                  <Link to={`/tags/${t.id}`}>{t.name}</Link>
                </Badge>
              ))}
            </div>
            )}

        </CardContent>
          

      <CardFooter className="flex items-center gap-2 pt-2 justify-between">
        {isWithinList && (
          <Button variant="outline" asChild>
            <Link to={`/quotes/${quote.id}`}>View details</Link>
          </Button>
        )}

        {canEdit && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/quotes/${quote.id}/edit`)}>
              Edit
            </Button>

            {/* Confirm before delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeletingQuote}>
                  {isDeletingQuote ? "Deleting…" : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this quote?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove the quote and its associations.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeletingQuote}
                  >
                    {isDeletingQuote ? "Deleting…" : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardFooter>

      {mutationError && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {mutationError}
        </p>
      )}
    </Card>
  );
}

export default QuoteCard;
