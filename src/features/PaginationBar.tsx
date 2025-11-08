import { Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious, 
  PaginationLink, 
  PaginationEllipsis } from "@/components/ui/pagination";

const PaginationBar = ({
  page,
  lastPage, 
  onPageChange
}: {
  page: number;
  lastPage: number;
  onPageChange: (newPage: number) => void;
}) => {
  
  return (
    <Pagination>
        <PaginationContent>

          {/* Only render Previous if we are on a page # greater than 1  */}
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && onPageChange(page - 1)}
                aria-disabled={page <= 1}
              />
          </PaginationItem>
          )}


          {/* Numbered links */}
          {Array.from({ length: lastPage }).map((_, i) => {
            const n = i + 1;
            // show first, last, current, +/-1 around current; collapse others
            if (n === 1 || n === lastPage || Math.abs(n - page) <= 1) {
              return (
                <PaginationItem key={n}>
                  <PaginationLink
                    isActive={n === page}
                    onClick={() => onPageChange(n)}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            if (n === page - 2 || n === page + 2) {
              return (
                <PaginationItem key={`ellipsis-${n}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          {/* Only render Next if there's a next page to visit */}
          {page < lastPage && (
            <PaginationItem>
              <PaginationNext
                onClick={() => page < lastPage && onPageChange(page + 1)}
                aria-disabled={page >= lastPage}
              />
            </PaginationItem>
          )}


        </PaginationContent>
      </Pagination>
  )
}

export default PaginationBar
