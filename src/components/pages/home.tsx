"use client";

import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import Link from "next/link";

const Stores = dynamic(() => import("@/components/stores"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      <Stores />
      <Link href={`/store`}>
        <Button>Example Store</Button>
      </Link>
    </>
  );
}
