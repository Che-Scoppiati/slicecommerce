import { createConfig, http } from "@wagmi/core";
import { base } from "@wagmi/core/chains";

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(`https://mainnet.base.org`),
  },
});

export { config };
