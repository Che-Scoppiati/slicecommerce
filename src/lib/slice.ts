import { env } from "@/lib/env";
import type { Config as WagmiConfig } from "@wagmi/core";
import { config as wagmiConfig } from "@/lib/wagmi";

import { getStores, getStoreProducts, getOrders } from "@slicekit/core";

// @slicekit/core Documentation reference: https://docs.slice.so/core/getting-started

async function getSliceStores() {
  const stores = await getStores({
    slicerIds: [env.SLICE_STORE_ID],
  });

  return stores;
}

async function getSliceStoreProducts(
  buyer: `0x${string}` | undefined,
  isOnsite: boolean | undefined
) {
  const { cartProducts, storeClosed } = await getStoreProducts(
    wagmiConfig as WagmiConfig,
    {
      slicerId: env.SLICE_STORE_ID,
      buyer: buyer, // Address of the buyer, used to determine eventual discounts. If not provided, base prices are returned.
      isOnsite: isOnsite,
    }
  );

  return { cartProducts, storeClosed };
}

async function getSliceStoreOrders(
  buyer: `0x${string}`,
  signature: string | undefined,
  first: number | undefined
) {
  const orders = await getOrders({
    buyer,
    signature,
    slicerId: env.SLICE_STORE_ID,
    thegraphApiKey: env.THEGRAPH_API_KEY,
    first,
  });

  return orders;
}

export { getSliceStoreProducts, getSliceStores, getSliceStoreOrders };
