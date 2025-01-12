import { ProductCart } from "@slicekit/core";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import { formatPrice } from "@/lib/price";
import { useFrameContext } from "@/hooks/frame-context";

export default function StorePage() {
  const { isSDKLoaded, context } = useFrameContext();
  const [products, setProducts] = useState<ProductCart[]>();

  const [isProductsLoading, setIsProductsLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsProductsLoading(true);
    try {
      const response = await fetch("/api/slice");
      const { data } = await response.json();
      console.log("frame products data", data);
      setProducts(data);
    } finally {
      setIsProductsLoading(false);
    }
  }, [setIsProductsLoading, setProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Talent Protocol</h1>
        <p className="text-gray-600 mb-4">
          You will never build alone. Connect with the best talent in the world.
        </p>
        <p className="text-sm text-gray-500">
          {products?.length || 0} products available
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
}
