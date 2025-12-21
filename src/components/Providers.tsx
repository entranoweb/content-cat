"use client";

import { ReactNode } from "react";
import { SWRConfig } from "swr";
import { PageErrorBoundary } from "./ErrorBoundary";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 10000,
        keepPreviousData: true,
      }}
    >
      <PageErrorBoundary>{children}</PageErrorBoundary>
    </SWRConfig>
  );
}
