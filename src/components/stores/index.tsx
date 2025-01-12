import { useCallback, useEffect, useState } from "react";
import sdk, {
  type Context,
} from "@farcaster/frame-sdk";
import { createStore } from "mipd";
import { SlicerBasics } from "@slicekit/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export default function StoresPage() {

  const [context, setContext] = useState<Context.FrameContext>();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [storesAreLoading, setStoresAreLoading] = useState(false);
  const [stores, setStores] = useState<SlicerBasics[]>([]);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  const fetchStores = useCallback(async () => {
    setStoresAreLoading(true);
    try {
      const response = await fetch("/api/slice/get-stores");
      const { data } = await response.json();
      console.log("frame stores data", data);
      setStores(data);
    } finally {
      setStoresAreLoading(false);
    }
  }, [setStoresAreLoading, setStores]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <h1 className="px-2 py-4 text-lg font-bold">Your Stores</h1>

      {storesAreLoading && <div className="px-2 py-4">Loading...</div>}

      <div className="grid grid-cols-2 gap-2 px-2">
        {stores.map((store) => (
          <Link href={`/${store.name}`} key={store.id}>
            <Card key={store.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {store.name}
                  <a href={`https://explorer.com/address/${store.address}`} target="_blank" rel="noopener noreferrer">
                    <SquareArrowOutUpRight size={16} />
                  </a>
                </CardTitle>
                <CardDescription>{store.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src={store.image ?? "/default-image.png"}
                  alt={store.name}
                  width={400}
                  height={400}
                  className="w-full h-auto bg-gray-300 rounded-md"
                />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}