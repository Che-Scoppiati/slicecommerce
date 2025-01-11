"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  type Context,
} from "@farcaster/frame-sdk";
import { createStore } from "mipd";

import { config as wagmiConfig } from "@/lib/wagmi";

import type { Config as WagmiConfig } from "@wagmi/core";
import { useCart, useCheckout } from "@slicekit/react";

import {
  useAccount,
} from "wagmi";

import { Button } from "@/components/ui/button";

import { ProductCart } from "@slicekit/core";
import { ProductCarousel } from "./product/product-carousel";
import { ProductVariants } from "./product/product-variants";
import { Header } from "./header";
import { ProductPrice } from "./product/product-price";

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const [product, setProduct] = useState<ProductCart>();
  const [, setIsProductsLoading] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [localCart, setLocalCart] = useState<ProductCart[]>([]);

  const [errorMsg, setErrorMsg] = useState<string>("");

  const { address } = useAccount();

  const {
    cart,
    addToCart,
    // updateCart,
    // removeFromCart,
    // updateCartProductQuantity,
    // updateCartProductVariant,
  } = useCart();

  const { checkout } = useCheckout(wagmiConfig as WagmiConfig, {
    buyer: address,
  });

  const addProductToCart = useCallback(
    async (productId: number) => {
      if (!address || !product) return;
      console.log("adding product to cart", productId);
      try {
        addToCart({
          product: {
            ...product,
            currency: product.currency.symbol || "USDC",
          },
          quantity: 1,
        });
        setLocalCart([...localCart, product]);
      } catch (error) {
        console.error("error adding to cart", error);
        setErrorMsg(
          "Error adding to cart" + (error instanceof Error ? error.message : "")
        );
      }
    },
    [addToCart, address, localCart, product]
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
        checkout();
      } catch (error) {
        console.error("error checking out", error);
        setErrorMsg(
          "Error checking out" + (error instanceof Error ? error.message : "")
        );
      }
    }
  }, [checkout, cart]);

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

  const fetchProducts = useCallback(async () => {
    setIsProductsLoading(true);
    try {
      const response = await fetch("/api/slice");
      const { data } = await response.json();
      console.log("frame products data", data);
      setProduct(data[0]);
    } finally {
      setIsProductsLoading(false);
    }
  }, [setIsProductsLoading, setProduct]);

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
      <Header username={context?.user.username} slicerName={product?.slicerName} pfpUrl={context?.user.pfpUrl} />

      <div className="text-red-500 text-lg">{errorMsg}</div>

      <div className="flex flex-row justify-between w-full mb-4 px-2">
        <div
          className="flex flex-col justify-left items-center gap-2 px-2"
          key={product.dbId}
        >
          <ProductCarousel product={product} />

          <div className="flex flex-col justify-left w-full gap-2">
            <h2 className="text-xl font-bold">{product.name}</h2>

            <ProductPrice product={product} />

            <ProductVariants product={product} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} />

            <div className="flex flex-col justify-left w-full gap-2">
              <h2 className="text-xl justify-left font-bold">Description</h2>
              {product.description.split("\n").map((line, index) => (
                <p className="text-sm" key={`line-${index}`}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="fixed bottom-[50px] left-0 right-0 flex justify-center z-50">
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
                  : "Add to cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
