import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const MissingItemNotice = ({ resourceName }: {resourceName: string}) => {
  return (
    <div className="p-4 sm:p-6">
      <Alert>
          <AlertTitle>{`No ${resourceName} found`}</AlertTitle>
          <AlertDescription>We couldn't find what you're looking for. It may have been moved, deleted, or you might not have access.</AlertDescription>
      </Alert>
    </div>
  )
};

export default MissingItemNotice;
