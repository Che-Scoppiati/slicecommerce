import { Context } from "@farcaster/frame-sdk";
import { useState } from "react";

export default function StorePage() {

  const [context, setContext] = useState<Context.FrameContext>();

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      Your Store Products
    </div>
  )
}