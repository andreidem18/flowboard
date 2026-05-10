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

export const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
