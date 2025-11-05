import type { Tag } from "../../../types";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type TagCardProps = {
  tag: Tag;
};

export const TagCardSkeleton = () => (
      <>
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <Skeleton className="h-7 w-40" /> {/* tag.name */}
        </div>
      </div>

      <Separator />

      {/* Basic info */}
      <div className="grid gap-2">
        {/* Author */}
        <Skeleton className="h-4 w-16" />        {/* "Author" label */}
        <Skeleton className="h-5 w-32" />        {/* creator.username */}

        <div className="mt-4">
          <Skeleton className="h-4 w-16" />      {/* "Created" label */}
        </div>
        <Skeleton className="h-5 w-40" />        {/* created_at */}
      </div>
    </>
)

function TagCard({ tag }: TagCardProps) {
  return (
        <>
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">
                {tag.name}
              </h1>
            </div>
          </div>

          <Separator />

          {/* Basic info */}
          <div className="grid gap-2">
            {tag.creator && (
              <>
                <div className="text-sm text-muted-foreground">Author</div>
                <div className="text-base">
                  <Link to={`/users/${tag.creator.id}`}>
                    {tag.creator.username}
                  </Link> 
                </div>
              </>
            )}

            <div className="text-sm text-muted-foreground mt-4">Created</div>
            <div className="text-base">{new Date(tag.created_at).toLocaleString()}</div>
          </div>
        </>
  );
}

export default TagCard;
