"use client";

import dynamic from "next/dynamic";

const Stores = dynamic(() => import("@/components/stores"), {
  ssr: false,
});

export default function StoresPage() {
  return <Stores />;
}
