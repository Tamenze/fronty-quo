import { useParams } from "react-router-dom"
import QuoteCard from "../components/QuoteCard"
import { useSpecificQuote } from "../hooks/useSpecificQuote"
import { useFetchCurrentUser } from "../../users/hooks/useFetchCurrentUser";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import { Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils"


export const QuoteShowPageSkeleton = () => (
  <Card className={cn("p-4 m-auto w-10/12 mb-3 min-h-[65vh] flex flex-col justify-center gap-4")} aria-hidden>
    <CardHeader className="pb-2">
      <CardTitle className="space-y-3">
        <Skeleton className="h-6 w-[85%]" />
        <Skeleton className="h-6 w-2/3" />
        <div className="mt-4 flex justify-start">
          <Skeleton className="h-4 w-48" />
        </div>
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-3">
      <Skeleton className="h-px w-full" />
      <div className={cn("flex flex-wrap gap-2 justify-start")}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);

function QuoteShowPage(){
  const {id} = useParams<{id: string}>();
  usePageTitle('Show Quote')

  const { data: quote, isPending, isError, error} = useSpecificQuote(Number(id))
  const {data: currentUser} = useFetchCurrentUser();

    if (isPending) return <QuoteShowPageSkeleton/>;
    if (isError)   return <p role="alert">Error: {error?.message}</p>;
    if (!quote)  return <p>No quote found.</p>;
  
  return (
    <>
      <QuoteCard 
        quote={quote} 
        canEdit={quote.user_id === currentUser?.id}
        className="min-h-[65vh] flex flex-col justify-center gap-4"
      />
    </>
  )
}

export default QuoteShowPage
