"use client";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div
        dangerouslySetInnerHTML={{
          __html: `<dotlottie-player
            src="/loading-animation.lottie"
            background="transparent"
            speed="1"
            autoplay
            loop
            style="width: 300px; height: 300px"
          ></dotlottie-player>`,
        }}
      />
    </div>
  );
}
