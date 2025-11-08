import QuotesList from "../components/QuotesList"
import { QuoteCardSkeleton } from "../components/QuoteCard";
import { useAllQuotes } from '../hooks/useAllQuotes';
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import ErrorNotice from "@/features/ErrorNotice";
import MissingItemNotice from "@/features/MissingItemNotice";

import { useSearchParams } from "react-router-dom";
import PaginationBar from "@/features/PaginationBar";




export const QuotesIndexPageSkeleton = () => (
  <div aria-hidden>
    <QuoteCardSkeleton className="rounded-t-xl"/>
    <QuoteCardSkeleton />
    <QuoteCardSkeleton className="rounded-b-xl"/>
  </div>
)

function QuotesIndexPage(){
  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get("page") || 1);
  const perPage = Number(sp.get("per_page") || 10);

  const {data, isPending, isError, error} = useAllQuotes(page, perPage)
  const quotes = data?.quotes;
  const pagination = data?.pagination;

  const lastPage = pagination?.last ?? 1;
  const onPageChange = (newPage: number) => {
    // React Query will refetch because queryKey includes { page, perPage }
    setSp({ page: String(newPage), per_page: String(perPage) }, { replace: false });
    if (!isPending){
          window.scrollTo({ top: 0, behavior: "instant" });

    }
  };

  usePageTitle('All Quotes')
  
    if (isPending) return <QuotesIndexPageSkeleton/>;
    if (isError) return <ErrorNotice title="Couldn't load quotes" error={error} />
    if (!quotes) return <MissingItemNotice resourceName="quotes"/>
  

  return(
    <>
      <QuotesList quotes={quotes} />

    {(pagination && pagination.count > pagination.limit) && (
      <PaginationBar 
          page={page}
          lastPage={lastPage}
          onPageChange={onPageChange}
      />
    )}
    </>
  )
}

export default QuotesIndexPage
