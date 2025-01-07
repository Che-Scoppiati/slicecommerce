import { env } from "@/lib/env";
import { config as wagmiConfig } from "@/lib/wagmi";

import { getStores, getStoreProducts, getOrders } from "@slicekit/core";

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
  const { cartProducts, storeClosed } = await getStoreProducts(wagmiConfig, {
    slicerId: env.SLICE_STORE_ID,
    buyer: buyer, // Address of the buyer, used to determine eventual discounts. If not provided, base prices are returned.
    isOnsite: isOnsite,
  });

  return { cartProducts, storeClosed };
}

async function getSliceStoreOrders(
  buyer: `0x${string}`,
  signature: `0x${string}`
) {
  const orders = await getOrders({
    buyer,
    signature,
    slicerId: env.SLICE_STORE_ID,
    thegraphApiKey: env.THEGRAPH_API_KEY,
    first: 10,
  });

  return orders;
}

export { getSliceStoreProducts, getSliceStores, getSliceStoreOrders };
