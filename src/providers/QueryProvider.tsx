import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type AnyObj = Record<string, unknown>;

const pickStatus = (o: unknown): number | undefined =>  {
  if (!o || typeof o !== "object") return undefined;

  // ApiError (or any object containing a numeric .status key)
  if (typeof (o as AnyObj).status === "number") return (o as AnyObj).status as number;

  // thrown Response (for case of `throw res`)
  if (typeof (o as Response)?.status === "number") return (o as Response).status;

  return undefined;
}

const getStatus = (e: unknown): number | undefined => {
  //if we successfully get a value of type number, return it 
  const direct = pickStatus(e);
  if (typeof direct === "number") return direct;

  //otherwise dig into Error.cause to try and get a value of type number
  const cause = (e as AnyObj | undefined)?.cause;
  const fromCause = pickStatus(cause);
  if (typeof fromCause === "number") return fromCause;

  return undefined;
}

const isNetworkish = (e: unknown): boolean => {
  // fetch network errors -> TypeError; aborts -> DOMException name: "AbortError"
  if (e instanceof TypeError) return true;
  const name = (e as AnyObj)?.name;
  return typeof name === "string" && name.toLowerCase() === "aborterror";
}


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount, error) {
        const statusCode = getStatus(error);

        if (statusCode) {
          // 4xx (except 408) => don't retry
          if (statusCode < 500 && statusCode !== 408) return false;

          // 5xx or 408 => retry up to 2 attempts total
          if (statusCode >= 500 || statusCode === 408) return failureCount < 2;
        }

        // No status (TypeError/AbortError/etc.) => retry if it's network-ish
        if (isNetworkish(error)) return failureCount < 2;

        return false;
      },
      throwOnError: (error) => { // determines when ErrorBoundary is rendered 
        const statusCode = getStatus(error);
        if (statusCode === undefined) return true; // unknown -> throw
        return statusCode >= 500;                  // 5xx    -> throw
      },
      staleTime: 30_000,
    },
    mutations: {
      retry: 0,
      throwOnError: (error) => {
        const statusCode = getStatus(error);
        if (statusCode === undefined) return true;
        return statusCode >= 500;
      },
    }
  }
});


const QueryProvider = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default QueryProvider
