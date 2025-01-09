"use client";

import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// TODO fix this slice
// import { SliceProvider } from "@slicekit/react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

const WagmiProvider = dynamic(() => import("@/lib/wagmi/wagmi-provider"), {
  ssr: false,
});

const queryClient = new QueryClient();

export function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      {/* <SliceProvider> */}
      <WagmiProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
      {/* </SliceProvider> */}
    </SessionProvider>
  );
}
