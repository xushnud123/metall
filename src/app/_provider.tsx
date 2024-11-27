"use client";

import { FC, ReactNode, Suspense } from "react";
import NextAdapterApp from "next-query-params/app";
import { QueryParamProvider } from "use-query-params";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ProviderProps {
  children: ReactNode;
}
const queryClient = new QueryClient();

const Provider: FC<ProviderProps> = ({ children }) => {
  return (
    <div className='block'>
      <QueryClientProvider client={queryClient}>
        <Suspense>
          <QueryParamProvider adapter={NextAdapterApp}>
            <ReactQueryDevtools initialIsOpen={false} />
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </QueryParamProvider>
        </Suspense>
      </QueryClientProvider>
    </div>
  );
};

export default Provider;
