"use client";

import dynamic from "next/dynamic";

const Product = dynamic(() => import("@/components/product"), {
  ssr: false,
});

export default function ProductPage({
  productName,
  storeName,
}: {
  productName: string;
  storeName: string;
}) {
  return <Product productName={productName} storeName={storeName} />;
}
