import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

import { SupabaseSessionProvider } from "./SupabaseSessionProvider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseSessionProvider>{children}</SupabaseSessionProvider>
    </QueryClientProvider>
  );
};

