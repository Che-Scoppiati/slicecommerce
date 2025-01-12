import { ProductCart } from "@slicekit/core";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import { formatPrice } from "@/lib/price";
import { useFrameContext } from "@/hooks/frame-context";
import { Header } from "../header";
import { useAccount } from "wagmi";

export default function StorePage() {
  const { isSDKLoaded, context } = useFrameContext();
  const [products, setProducts] = useState<ProductCart[]>();
  const [slicerId, setSlicerId] = useState<number>(2006);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const { address } = useAccount();

  const fetchProducts = useCallback(async () => {
    setIsProductsLoading(true);
    try {
      const response = await fetch(
        `/api/slice?slicerId=${slicerId}&buyer=${address}&isOnsite=false`
      );
      const { data } = await response.json();
      console.log("frame products data", data);
      setProducts(data);
    } finally {
      setIsProductsLoading(false);
    }
  }, [address, slicerId]);

  useEffect(() => {
    if (slicerId && address) {
      fetchProducts();
    }
  }, [fetchProducts, slicerId, address]);

  useEffect(() => {
    if (products && products[0]) {
      setSlicerId(products[0].slicerId);
    }
  }, [products]);

  console.log({
    isSDKLoaded,
    isProductsLoading,
    products,
    context,
  });

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  if (isProductsLoading) {
    return <div>Loading products...</div>;
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
        <h1 className="text-3xl font-bold mb-2">Talent Protocol</h1>
        <p className="text-gray-600 mb-4">
          You will never build alone. Connect with the best talent in the world.
        </p>
        <p className="text-sm text-gray-500">
          {products?.length || 0} products available
        </p>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
          {products?.map((product) => (
            <Link
              href={`/stores/${product.slicerId}/${product.productId}`}
              key={product.productId}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4 pb-0">
                  <div className="aspect-w-16 aspect-h-9">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      width={200}
                      height={200}
                    />
                    <p className="text-md font-semibold my-2">
                      {product.name.length > 25
                        ? product.name.substring(0, 25) + "..."
                        : product.name}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <p className="text-blue-600 font-bold">
                    {formatPrice(product.price, product.currency)}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
