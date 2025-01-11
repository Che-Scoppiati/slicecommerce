import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

import { getSession } from "@/lib/auth";
import { Providers } from "@/components/providers";

const lexend = Lexend({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Slice Frames v2 Demo",
  description: "Slice Frames v2 Demo",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className="size-full min-h-screen">
      <body
        className={`${lexend.className} antialiased`}
      >
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
