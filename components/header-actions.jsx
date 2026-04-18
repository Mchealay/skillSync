"use client";

import { Button } from "./ui/button";
import { BUTTONS_MENUS } from "@/lib/constants";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemSwitch from "./theme-switch";

export default function HeaderActions() {
  return (
    <div className="flex items-center space-x-3 md:space-x-6">
      <Show when="signed-in">
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
              <Link href="/ai-cover-letter" className="flex items-center gap-3">
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
      </Show>

      <Show when="signed-out">
        <SignInButton>
          <Button variant="outline" className="glass hover:bg-white/5 px-6 rounded-xl border-white/10">
            {BUTTONS_MENUS.SIGN_IN}
          </Button>
        </SignInButton>
      </Show>

      <Show when="signed-in">
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
      </Show>

      <ThemSwitch />
    </div>
  );
}
