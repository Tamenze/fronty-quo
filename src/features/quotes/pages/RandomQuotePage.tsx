import { useRandomQuote } from '../hooks/useRandomQuote';
import { usePageTitle } from '../../../shared/hooks/usePageTitle';
import { Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils"
import ErrorNotice from "@/features/ErrorNotice";
import MissingItemNotice from "@/features/MissingItemNotice";


import QuoteCard from '../components/QuoteCard';

const RandomQuotePageSkeleton = () => (
  <Card className={cn("p-4 m-auto w-10/12 mb-3 min-h-[65vh] flex flex-col justify-center text-center gap-4")}>
    <CardHeader className="pb-2">
      <CardTitle className="space-y-3">
        <Skeleton className="h-6 w-[85%] mx-auto" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
        <div className="mt-4 flex justify-center">
          <Skeleton className="h-4 w-48" />
        </div>
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-3">
      <Skeleton className="h-px w-full" />
      <div className={cn("flex flex-wrap gap-2 justify-center")}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>
    </CardContent>
  </Card>
)

function RandomQuotePage(){
  const {data: quote, isPending, isError, error } = useRandomQuote();
  usePageTitle('Home');

  if (isPending) return <RandomQuotePageSkeleton />;
  if (isError) return <ErrorNotice title="Couldn't load quote" error={error} />
  if (!quote) return <MissingItemNotice resourceName="quote"/>

  return(
    <QuoteCard 
      quote={quote} 
      canEdit={false}
      className="min-h-[65vh] flex flex-col justify-center text-center gap-4"
      isHero
      centerTags
    />
  )
}

export default RandomQuotePage
