import { Metadata } from "next";
import { env } from "@/lib/env";
import StoresPage from "@/components/pages/stores";

const appUrl = env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/opengraph-image`,
  button: {
    title: "Launch SliceCommerce",
    action: {
      type: "launch_frame",
      name: "SliceCommerce",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "SliceCommerce",
    openGraph: {
      title: "SliceCommerce",
      description: "A slice commerce frame v2.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Stores() {
  return <StoresPage />;
}
