import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface HeaderProps {
  title: string;
  slicer?: {
    id: number;
    name: string;
  };
  user?: {
    pfp?: string;
    username?: string;
  };
}

export function Header(props: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {props.slicer ? (
            <div className="flex flex-row items-center justify-center">
              <Link href="/stores">
                <div className="flex flex-row items-center justify-center rounded-full bg-zinc-800 text-white text-xs w-[32px] h-[32px]">
                  <p>{"SC".toUpperCase().slice(0, 2)}</p>
                </div>
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-700 mx-2" />
              <Link href={`/stores/${props.slicer.id}`}>
                <p className="text-md text-gray-700">{props.slicer.name}</p>
              </Link>
            </div>
          ) : (
            <Link href="/stores">
              <h1 className="text-xl font-bold">{props.title}</h1>
            </Link>
          )}

          {props.user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                {props.user.pfp ? (
                  <Image
                    src={props.user.pfp ?? "/default-pfp.png"}
                    alt={props.user.username ?? "User"}
                    className="w-8 h-8 rounded-full"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="flex flex-row items-center justify-center rounded-full bg-zinc-800 text-white text-xs w-[32px] h-[32px]">
                    <p>{"W".toUpperCase().slice(0, 2)}</p>
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {props.user.username ?? "Me"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>My orders</DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/user/stores">My stores</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
