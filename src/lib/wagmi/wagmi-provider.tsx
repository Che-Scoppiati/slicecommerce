import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WagmiProvider as WagmiDefaultProvider } from "wagmi";
import { config } from "@/lib/wagmi/config";

const queryClient = new QueryClient();

export default function WagmiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiDefaultProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiDefaultProvider>
  );
}
