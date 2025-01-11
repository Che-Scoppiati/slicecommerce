"use client";

import Link from "next/link";
import Image from "next/image";

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
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { ProductCart } from "@slicekit/core";
import { cn } from "@/lib/utils";

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const [products, setProducts] = useState<ProductCart[]>([]);
  const [, setIsProductsLoading] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [localCart, setLocalCart] = useState<ProductCart[]>([]);

  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

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
      if (!address) return;
      console.log("adding product to cart", productId);
      try {
        addToCart({
          product: {
            ...products[0],
            currency: products[0].currency.symbol || "USDC",
          },
          quantity: 1,
        });
        setLocalCart([...localCart, products[0]]);
      } catch (error) {
        console.error("error adding to cart", error);
        setErrorMsg(
          "Error adding to cart" + (error instanceof Error ? error.message : "")
        );
      }
    },
    [addToCart, address, localCart, products]
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
      const data = await response.json();
      console.log("frame products data", data);
      setProducts(data.data);
    } finally {
      setIsProductsLoading(false);
    }
  }, [setIsProductsLoading, setProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
      <div className="flex flex-row justify-between w-full mb-4 px-2 py-4">
        <Link href="/" className="text-lg font-bold">
          {products?.[0]?.slicerName || "Shop name"}
        </Link>
        {context?.user ? (
          context.user.pfpUrl ? (
            <div className="flex flex-row items-center gap-2">
              <Image
                src={context?.user.pfpUrl || "/icon.png"}
                width={32}
                height={32}
                alt={`${context?.user.username} profile picture`}
                className="rounded-full"
              />
              <p className="text-lg font-bold">{context?.user.username}</p>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center gap-2 rounded-full bg-zinc-800 text-white text-xs pt-1 w-[32px] h-[32px]">
              <p>{(context?.user.username || "W").toUpperCase().slice(0, 2)}</p>
            </div>
          )
        ) : (
          <div className="flex flex-row justify-center items-center gap-2 rounded-full bg-zinc-800 text-white text-xs pt-1 w-[32px] h-[32px]">
            <p>{"W".toUpperCase()}</p>
          </div>
        )}
      </div>

      <div className="text-red-500 text-lg">{errorMsg}</div>

      <div className="flex flex-row justify-between w-full mb-4 px-2">
        {products.map((product) => (
          <div
            className="flex flex-col justify-left items-center gap-2 px-2"
            key={product.dbId}
          >
            <div className="flex flex-col items-center gap-2 w-full mx-auto">
              <Carousel className="w-[80%]" setApi={setApi}>
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-0">
                          <ZoomableImage
                            src={image}
                            alt={`${product.name} image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="pt-1 text-center text-sm text-muted-foreground">
                Image {current} of {count}
              </div>
            </div>
            <div className="flex flex-col justify-left w-full gap-2">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <div className="flex flex-row justify-left items-center w-full gap-2">
                <h1 className="text-2xl font-bold border border-slate-500 rounded-md p-2 w-fit bg-blue-500 text-white">
                  {Number(product.price) /
                    10 ** (product.currency.decimals || 6)}{" "}
                  {product.currency.symbol}
                </h1>
                <span className="text-sm text-muted-foreground">on</span>
                <Image
                  src="/images/logo-base.png"
                  width={24}
                  height={24}
                  alt="Base logo"
                />
              </div>
              <div className="w-full max-w-md mx-auto pb-2">
                <h2 className="text-lg font-semibold mb-2">Select Variant</h2>
                <div className="relative">
                  <div className="flex overflow-x-auto -mx-2 px-2 scrollbar-hide">
                    {product.externalProduct?.providerVariants.map(
                      (variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant.variant)}
                          className={cn(
                            "flex-shrink-0 h-10 px-4 mr-2 text-sm text-black rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                            selectedVariant === variant.variant
                              ? "bg-blue-600 text-white border-transparent"
                              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                          )}
                        >
                          {variant.variant}
                        </button>
                      )
                    )}
                  </div>
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white pointer-events-none" />
                </div>
                {selectedVariant && (
                  <p className="mt-4 text-sm text-gray-600">
                    Selected variant:{" "}
                    <span className="font-semibold">{selectedVariant}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-left w-full gap-2">
                <h2 className="text-xl justify-left font-bold">Description</h2>
                {product.description.split("\n").map((line, index) => (
                  <p className="text-sm" key={`line-${index}`}>
                    {line}
                  </p>
                ))}
              </div>
              {products
                .filter((p) => p.dbId !== product.dbId)
                .map((p) => (
                  <div
                    className="flex flex-col justify-left w-full gap-2"
                    key={p.dbId}
                  >
                    <h2 className="text-xl justify-left font-bold">
                      Other products
                    </h2>
                    {p.description.split("\n").map((line, index) => (
                      <p className="text-sm" key={`line-${index}`}>
                        {line}
                      </p>
                    ))}
                  </div>
                ))}
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
        ))}
      </div>
    </div>
  );
}
