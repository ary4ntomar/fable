import Link from "next/link";
import { House, Clapperboard, CircleUserRound, Images } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground w-full overflow-x-hidden">
      <nav className="sticky top-0 flex items-center justify-between border-b border-border bg-background z-50 px-4 sm:px-8 py-2">

        <header className="font-bold text-2xl md:text-3xl text-accent cursor-default">
          Fable
        </header>

        <div className="flex  items-center gap-5 md:gap-8 font-sans text-base ">
          <Link href="/feed" className="flex items-center gap-2 transition-all duration-200 group hover:bg-accent/10 hover:px-3 hover:pt-1 hover:pb-2 hover:rounded-xl ">
            <House className="group-hover:text-accent size-4 md:size-[18px]" />
            <span className="hidden md:block">Feed</span>
          </Link>

          <Link href="/avatars" className="flex items-center gap-2 group transition-all duration-200 hover:bg-accent/10 hover:px-2 hover:pt-1 hover:pb-2 hover:rounded-xl">
            <Images className="group-hover:text-accent size-4 md:size-[18px]" />
            <span className="hidden md:block">Avatars</span>
          </Link>

          <Link href="/videos" className="flex items-center gap-2 transition-all duration-200 group hover:bg-accent/10 hover:px-2 hover:pt-1 hover:pb-2 hover:rounded-xl">
            <Clapperboard className="group-hover:text-accent size-4 md:size-[18px]" />
            <span className="hidden md:block">Videos</span>
          </Link>
        </div>

        <Link href="/me" className="flex items-center gap-2 border-l border-border pl-6 font-sans text-xl">
          <CircleUserRound className="text-accent " />
          <span className="hidden md:block">Me</span>
        </Link>

      </nav>

      <main>{children}</main>
    </div>
  );
}