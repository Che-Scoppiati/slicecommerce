import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFrameContext } from "@/hooks/frame-context";

export default function Home() {
  const { isSDKLoaded } = useFrameContext();

  if (!isSDKLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <Image
          src="/images/logo-slice.png"
          alt="Slice Commerce Logo"
          className="w-32 h-32 object-contain rounded-xl"
          width={128}
          height={128}
        />
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Welcome to Slice Commerce
        </h1>
        <Link href="/stores">
          <Button variant="default" size="lg">
            Enter
          </Button>
        </Link>
      </div>
    </div>
  );
}
