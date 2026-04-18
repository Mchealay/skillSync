import React from "react";
import { Button } from "./ui/button";
import { BUTTONS_MENUS } from "@/lib/constants";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import { useTheme } from "next-themes";
import ThemSwitch from "./theme-switch";


export default async function Header() {
  await checkUser();

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 glass border-none">
      <nav className="container mx-auto px-4 h-18 flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src={"/skill.png"}
            alt="skillSync Logo"
            width={200}
            height={60}
            className="h-10 py-1 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 md:space-x-6">
          <SignedIn>
            <Link href="/dashboard" className="hidden md:block">
              <Button
                variant="ghost"
                className="flex items-center gap-2 font-medium hover:bg-white/5 transition-all text-muted-foreground hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                {BUTTONS_MENUS.DASHBOARD_INSIGHTS}
              </Button>
            </Link>

            {/* Growth Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 px-6">
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">{BUTTONS_MENUS.GROWTH_TOOLS}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border-white/5 p-2 rounded-2xl">
                <DropdownMenuItem asChild className="rounded-xl focus:bg-white/5 cursor-pointer py-3">
                  <Link href="/resume" className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{BUTTONS_MENUS.BUILD_RESUME}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl focus:bg-white/5 cursor-pointer py-3">
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <PenBox className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{BUTTONS_MENUS.COVER_LETTER}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl focus:bg-white/5 cursor-pointer py-3">
                  <Link href="/interview" className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{BUTTONS_MENUS.INTERVIEW_PREP}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="glass hover:bg-white/5 px-6 rounded-xl border-white/10">{BUTTONS_MENUS.SIGN_IN}</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="pl-2 border-l border-white/10 ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border-2 border-primary/20",
                    userButtonPopoverCard: "glass border-white/10 shadow-3xl rounded-2xl",
                    userPreviewMainIdentifier: "font-bold",
                  },
                }}
                afterSignOutUrl="/"
              />
            </div>
          </SignedIn>
          <ThemSwitch />
        </div>
      </nav>
    </header>
  );
}

