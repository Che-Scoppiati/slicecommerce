import { Metadata } from "next";
import { env } from "@/lib/env";
import Product from "@/components/pages/product";

const appUrl = env.NEXT_PUBLIC_URL;

const frame = (storeName: string, productName: string) => ({
  version: "next",
  imageUrl: `${appUrl}/${storeName}/${productName}/opengraph-image`,
  button: {
    title: "Launch Frame",
    action: {
      type: "launch_frame",
      name: "Farcaster Frames v2 Demo",
      url: appUrl,
      splashImageUrl: `${appUrl}/${storeName}/${productName}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
});

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeName: string; productName: string }>;
}): Promise<Metadata> {
  const { storeName, productName } = await params;
  return {
    title: "Farcaster Frames v2 Demo",
    openGraph: {
      title: "Farcaster Frames v2 Demo",
      description: "A Farcaster Frames v2 demo app.",
    },
    other: {
      "fc:frame": JSON.stringify(frame(storeName, productName)),
    },
  };
}

export default function ProductPage() {
  return <Product />;
}
