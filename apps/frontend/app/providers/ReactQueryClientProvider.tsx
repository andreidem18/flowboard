import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";

const onError = () => {
  toast.error("Hubo un error inesperado");
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError,
  }),
  mutationCache: new MutationCache({
    onError,
  }),
});

// TypeScript only:
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: QueryClient;
  }
}

export const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  if (typeof window !== "undefined") {
    window.__TANSTACK_QUERY_CLIENT__ = queryClient;
  }
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
