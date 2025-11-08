import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";



const ErrorNotice = ({ title, error }: {title: string; error: Error}) => {
  return (
    <div className="p-4 sm:p-6">
      <Alert variant="destructive">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{error?.message ?? "Something went wrong."}</AlertDescription>
      </Alert>
    </div>
  )
};

export default ErrorNotice;
