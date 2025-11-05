import { useParams } from "react-router-dom"
import TagCard, { TagCardSkeleton } from "../components/TagCard";
import { useGetTag } from "../hooks/useGetTag";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import QuotesList from "@/features/quotes/components/QuotesList";
import { QuoteCardSkeleton } from "@/features/quotes/components/QuoteCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const TagShowPageSkeleton = () => {
   return (
      <div className="p-4 sm:p-6" aria-hidden>
      <Card className="p-6 space-y-6">
        {/* TagCard area */}
        <TagCardSkeleton />

        {/* Quotes */}
        <Separator />
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">
            <Skeleton className="h-5 w-56" /> {/* "Quotes with this tag" */}
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" /> {/* subtext */}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          {/* Mimic QuotesList rendering QuoteCard items */}
          <div>
            <QuoteCardSkeleton />
            <QuoteCardSkeleton />
            <QuoteCardSkeleton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
      // <div className="p-4 sm:p-6" aria-hidden>
      //    <Card className="p-6 space-y-6">

      //    {/* Tag Card  */}
      //    <div className="flex items-center justify-between">
      //       <Skeleton className="h-7 w-48" />
      //       <Skeleton className="h-5 w-24" />
      //    </div>

      //    <Separator />

      //    {/* Quotes Header  */}
      //    <div className="space-y-3">
      //       <Skeleton className="h-4 w-64" />
      //       <Skeleton className="h-4 w-48" />
      //       <Skeleton className="h-4 w-56" />
      //    </div>

      //    <Separator />

      //    <Skeleton className="h-5 w-36" />
      //    <div className="space-y-3">
      //       <Skeleton className="h-20 w-full" />
      //       <Skeleton className="h-20 w-full" />
      //       <Skeleton className="h-20 w-full" />
      //    </div>
      //    </Card>
      // </div>
   // )
};


function TagShowPage(){
   const { id } = useParams<{id: string}>();
   usePageTitle('Show Tag')

   const { data: tag, isPending, isError, error } = useGetTag(Number(id));

    if (isPending) return <TagShowPageSkeleton />;
    
    if (isError){
      return (
         <div className="p-4 sm:p-6">
            <Alert variant="destructive">
               <AlertTitle>Couldn't load tag</AlertTitle>
               <AlertDescription>{error?.message ?? "Something went wrong."}</AlertDescription>
            </Alert>
         </div>
      )
    };

    if (!tag){
      return (
         <div className="p-4 sm:p-6">
            <Alert>
               <AlertTitle>No tag found</AlertTitle>
               <AlertDescription>The tag you're looking for doesn't exist.</AlertDescription>
            </Alert>
         </div>
      )
    };
  
   return (
      <div className="p-4 sm:p-6">
         <Card className="p-6 space-y-6">

            <TagCard tag={tag}/>

            {/* Quotes */}
            <Separator />
            <CardHeader className="px-0 pt-0">
               {/* future: return and display count */}
               <CardTitle className="text-lg">
                  Quotes with this tag
               </CardTitle>
               <CardDescription>
                  {tag.quotes?.length ? "All quotes associated with this tag." : "No associated quotes yet."}
               </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
               <QuotesList quotes={tag.quotes} />
            </CardContent>
         </Card>
      </div>
   )
}

export default TagShowPage
