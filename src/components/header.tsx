import Link from "next/link"
import Image from "next/image";

interface HeaderProps {
  username: string | undefined;
  slicerName: string | undefined;
  pfpUrl: string | undefined;
}

export const Header: React.FC<HeaderProps> = ({
  username,
  slicerName,
  pfpUrl
}) => {
  return (
    <div className="flex flex-row justify-between w-full mb-4 px-2 py-4">
      <Link href="/" className="text-lg font-bold">
        {slicerName || "Shop name"}
      </Link>
      {pfpUrl ? (
        <div className="flex flex-row items-center gap-2">
          <Image
            src={pfpUrl || "/icon.png"}
            width={32}
            height={32}
            alt={`${username} profile picture`}
            className="rounded-full"
          />
          <p className="text-lg font-bold">{username}</p>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center gap-2 rounded-full bg-zinc-800 text-white text-xs pt-1 w-[32px] h-[32px]">
          <p>{(username || "W").toUpperCase().slice(0, 2)}</p>
        </div>
      )}
    </div>
  )
}