import { useCallback, useEffect, useState } from "react";
import { SlicerBasics } from "@slicekit/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useFrameContext } from "@/hooks/frame-context";
import { Header } from "../header";

export default function StoresPage() {
  const { isSDKLoaded, context } = useFrameContext();
  const [storesAreLoading, setStoresAreLoading] = useState(false);
  const [stores, setStores] = useState<SlicerBasics[]>([]);

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

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <Header
        title="Slice Commerce"
        user={{
          pfp: context?.user.pfpUrl,
          username: context?.user.username,
        }}
      />

      <div className="p-4">
        <h1 className="text-lg font-bold mb-4">Stores</h1>

        {storesAreLoading && <div className="py-4">Loading...</div>}

        <div className="grid grid-cols-2 gap-2 px-2">
          {stores.map((store) => (
            <Card key={store.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {store.name}
                  <a
                    href={`https://base.blockscout.com/address/${store.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SquareArrowOutUpRight size={16} />
                  </a>
                </CardTitle>
                <Link href={`stores/${store.id}`} key={store.id}>
                  <CardDescription>{store.description}</CardDescription>
                </Link>
              </CardHeader>
              <Link href={`stores/${store.id}`} key={store.id}>
                <CardContent>
                  <Image
                    src={store.image ?? "/default-image.png"}
                    alt={store.name}
                    width={400}
                    height={400}
                    className="w-full h-auto bg-gray-300 rounded-md"
                  />
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
