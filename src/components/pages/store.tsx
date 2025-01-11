"use client";

import dynamic from "next/dynamic";

const Store = dynamic(() => import("@/components/store"), {
  ssr: false,
});

export default function StorePage() {
  return <Store />;
}
