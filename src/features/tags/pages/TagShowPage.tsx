import { useParams } from "react-router-dom"
import TagCard, { TagCardSkeleton } from "../components/TagCard";
import { useGetTag } from "../hooks/useGetTag";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import QuotesList from "@/features/quotes/components/QuotesList";
import { QuoteCardSkeleton } from "@/features/quotes/components/QuoteCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorNotice from "@/features/ErrorNotice";
import MissingItemNotice from "@/features/MissingItemNotice";
import {useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PaginationBar from "@/features/PaginationBar";



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
};


function TagShowPage(){
   usePageTitle('Show Tag');
   const { id } = useParams<{id: string}>();
   const [sp, setSp] = useSearchParams();
   const page = Number(sp.get("page") || 1);
   const perPage = Number(sp.get("per_page") || 10);

     
  const listRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef<number | null>(null);

   const { 
      data: { tag, pagination } = {}, 
      isPending, 
      isError, 
      error 
   } = useGetTag(Number(id), page, perPage)
   const lastPage = pagination?.last ?? 1;

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



    if (isPending) return <TagShowPageSkeleton />;
    if (isError) return <ErrorNotice title="Couldn't load tag" error={error} />
    if (!tag) return <MissingItemNotice resourceName="tag"/>

  
   return (
      <div className="p-4 sm:p-6">
         <Card className="p-6 space-y-6">

            <TagCard tag={tag}/>

            {/* Quotes */}
            <Separator />
            <CardHeader className="px-0 pt-0" ref={listRef}>
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
               {(pagination && pagination.count > pagination.limit) && (
                  <PaginationBar 
                     page={page}
                     lastPage={lastPage}
                     onPageChange={onPageChange}
                  />
               )}
            </CardContent>
         </Card>
      </div>
   )
}

export default TagShowPage
