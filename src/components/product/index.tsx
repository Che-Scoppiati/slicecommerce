"use client";

import { useEffect, useCallback, useState } from "react";
import { config as wagmiConfig } from "@/lib/wagmi";
import { useCart, useCheckout } from "@slicekit/react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { ProductCart } from "@slicekit/core";
import { ProductCarousel } from "./product-carousel";
import { ProductVariants } from "./product-variants";
import { ProductPrice } from "./product-price";
import { Header } from "../header";
import { useFrameContext } from "@/hooks/frame-context";

export default function ProductPage() {
  const { isSDKLoaded, context } = useFrameContext();

  const [product, setProduct] = useState<ProductCart>();
  const [, setIsProductsLoading] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [localCart, setLocalCart] = useState<ProductCart[]>([]);

  const [errorMsg, setErrorMsg] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [slicerId, setSlicerId] = useState(2006);

  const { address } = useAccount();

  const {
    cart,
    addToCart,
    updateCart,
    // removeFromCart,
    // updateCartProductQuantity,
  } = useCart();

  console.log("cart", cart);

  const { checkout } = useCheckout(wagmiConfig, {
    buyer: address,
  });

  const addProductToCart = useCallback(
    async (productId: number) => {
      if (!address || !product) return;
      console.log("adding product to cart", productId);
      try {
        if (!cart) {
          updateCart(cart);
        }
        addToCart({
          product: {
            ...product,
            currency: product.currency.symbol || "USDC",
          },
          quantity: 1,
          variantId: selectedVariant!,
        });
        setLocalCart([...localCart, product]);
      } catch (error) {
        console.error("error adding to cart", error);
        setErrorMsg(
          "Error adding to cart" + (error instanceof Error ? error.message : "")
        );
      }
    },
    [addToCart, address, cart, localCart, product, selectedVariant, updateCart]
  );

  const completeCheckout = useCallback(
    async (productId: number) => {
      console.log("completing checkout for product", productId);
      try {
        checkout();
        setLocalCart((prev) => prev.filter((p) => p.productId !== productId));
      } catch (error) {
        console.error("error checking out", error);
        setErrorMsg(
          "Error checking out" + (error instanceof Error ? error.message : "")
        );
      }
    },
    [checkout]
  );

  useEffect(() => {
    if (cart.length > 0) {
      try {
        console.log("TRYING TO CHECKOUT");
        checkout();
      } catch (error) {
        console.error("error checking out", error);
        setErrorMsg(
          "Error checking out" + (error instanceof Error ? error.message : "")
        );
      }
    }
  }, [checkout, cart]);

  const fetchProducts = useCallback(async () => {
    setIsProductsLoading(true);
    try {
      const response = await fetch(
        `/api/slice?slicerId=${slicerId}&buyer=${address}&isOnsite=false`
      );
      const { data } = await response.json();
      console.log("frame products data", data);
      setProduct(data[0]);
    } finally {
      setIsProductsLoading(false);
    }
  }, [address, slicerId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  if (!product) {
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
        title={product.slicerName || "Slice Commerce"}
        user={{
          pfp: context?.user.pfpUrl,
          username: context?.user.username,
        }}
        slicer={{ name: product.slicerName || "Slicer", id: slicerId }}
      />

      <div className="text-red-500 text-lg my-4">{errorMsg}</div>

      <div className="flex flex-row justify-between w-full p-4">
        <div
          className="flex flex-col justify-left items-center gap-8 px-2 pb-36"
          key={product.dbId}
        >
          <ProductCarousel product={product} />

          <div className="flex flex-col justify-left w-full gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <ProductPrice product={product} />
            </div>

            <ProductVariants
              product={product}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
            />

            <div className="flex flex-col justify-left w-full gap-2">
              <h2 className="text-xl justify-left font-bold">Description</h2>
              <div className="flex flex-col gap-2">
                {product.description.split("\n").map((line, index) => (
                  <p className="text-sm" key={`line-${index}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="fixed bottom-[50px] left-0 right-0 flex justify-center z-50">
            <div className="flex gap-4">
              <Button
                className="w-fit max-w-md bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold px-8 py-6 rounded-xl shadow-lg"
                onClick={() => {
                  if (localCart.find((p) => p.productId === product.dbId)) {
                    completeCheckout(product.dbId);
                  } else {
                    addProductToCart(product.dbId);
                  }
                }}
                disabled={
                  !selectedVariant &&
                  (product.externalProduct?.providerVariants || []).length > 0
                }
              >
                {!selectedVariant &&
                (product.externalProduct?.providerVariants || []).length > 0
                  ? "Select a variant"
                  : localCart.find((p) => p.productId === product.dbId)
                  ? "Checkout"
                  : "Add to Cart" +
                    (cart.length > 0 ? " (" + cart.length + " items)" : "")}
              </Button>
              {cart.length > 0 && (
                <Button
                  className="w-fit max-w-md bg-red-500 hover:bg-red-600 text-white text-lg font-bold px-8 py-6 rounded-xl shadow-lg"
                  onClick={() => updateCart([])}
                >
                  Reset Cart
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
