import { Metadata } from "next";
import { env } from "@/lib/env";
import Store from "@/components/pages/store";

const appUrl = env.NEXT_PUBLIC_URL;

const frame = (storeName: string) => ({
  version: "next",
  imageUrl: `${appUrl}/${storeName}/opengraph-image`,
  button: {
    title: "Launch Frame",
    action: {
      type: "launch_frame",
      name: "Farcaster Frames v2 Demo",
      url: appUrl,
      splashImageUrl: `${appUrl}/${storeName}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
});

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeName: string }>;
}): Promise<Metadata> {
  const { storeName } = await params;
  return {
    title: "Farcaster Frames v2 Demo",
    openGraph: {
      title: "Farcaster Frames v2 Demo",
      description: "A Farcaster Frames v2 demo app.",
    },
    other: {
      "fc:frame": JSON.stringify(frame(storeName)),
    },
  };
}

export default function StorePage() {
  return <Store />;
}
