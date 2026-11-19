"use client";

import {
  Menu,
  Images,
  Video,
  Image,
  Clapperboard,
  LogOut,
  Sparkles,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useLogout from "./logout";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const navigation = [
 
  {
    name: "Avatar Studio",
    href: "/avatars",
    icon: Images,
  },
  {
    name: "Video Studio",
    href: "/videos",
    icon: Video,
  },
  {
    name: "My Avatars",
    href: "/myAvatars",
    icon: Image,
  },
  {
    name: "My Videos",
    href: "/myVideos",
    icon: Clapperboard,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            className=" hover:bg-accent/10"
          />
        }
      >
        <Menu size={23} />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex w-[280px] flex-col border-r border-border bg-surface p-0 [&_[data-slot=sheet-close]]:text-white"
      >
        {/* Brand */}
        <SheetHeader className="border-b border-border px-6 py-6 text-left">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold tracking-widest text-accent">
            <Sparkles size={21} />
            FABLE
          </SheetTitle>

          <SheetDescription className="text-xs text-foreground">
            Your AI creative workspace
          </SheetDescription>
        </SheetHeader>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-foreground">
            Workspace
          </p>

          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-3
                    text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-accent/15 text-accent shadow-sm"
                        : " hover:bg-accent/10 text-foreground"
                    }
                  `}
                >
                  <Icon size={19} strokeWidth={1.8} />

                  <span>{item.name}</span>

                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-accent" />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={() => useLogout()}
          >
            <LogOut size={19} />
            Logout
          </Button>

          <p className="mt-4 px-3 text-xs text-foreground">
            FABLE © 2026
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
