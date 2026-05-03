"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { BUTTONS_MENUS } from "@/lib/constants";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeSwitch from "./theme-switch";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderActions() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex items-center space-x-3 md:space-x-6">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <Show when="signed-in">
          <Link href="/dashboard">
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
                <span>{BUTTONS_MENUS.GROW_TOOLS}</span>
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
      </div>

      <Show when="signed-out">
        <SignInButton>
          <Button variant="outline" className="glass hover:bg-white/5 px-4 md:px-6 rounded-xl border-white/10">
            {BUTTONS_MENUS.SIGN_IN}
          </Button>
        </SignInButton>
      </Show>

      {/* User Actions & Theme */}
      <div className="flex items-center space-x-2">
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

        <ThemeSwitch />

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 p-6 z-40 md:hidden flex flex-col space-y-4 shadow-2xl"
          >
            <Show when="signed-in">
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-xl">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">{BUTTONS_MENUS.DASHBOARD_INSIGHTS}</span>
                </Button>
              </Link>
              <div className="h-px bg-white/5 mx-2" />
              <Link href="/resume" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-xl">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">{BUTTONS_MENUS.BUILD_RESUME}</span>
                </Button>
              </Link>
              <Link href="/ai-cover-letter" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-xl">
                  <PenBox className="h-5 w-5 text-purple-400" />
                  <span className="text-lg font-medium">{BUTTONS_MENUS.COVER_LETTER}</span>
                </Button>
              </Link>
              <Link href="/interview" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-xl">
                  <GraduationCap className="h-5 w-5 text-green-400" />
                  <span className="text-lg font-medium">{BUTTONS_MENUS.INTERVIEW_PREP}</span>
                </Button>
              </Link>
            </Show>

            <Show when="signed-out">
              <Link href="#features" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-xl">
                  <StarsIcon className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">Features</span>
                </Button>
              </Link>
              <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-xl">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">How it Works</span>
                </Button>
              </Link>
              <Link href="#testimonials" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-xl">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">Testimonials</span>
                </Button>
              </Link>
              <div className="h-px bg-white/5 mx-2" />
              <SignInButton>
                <Button className="w-full h-14 text-lg font-bold rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                  {BUTTONS_MENUS.SIGN_IN}
                </Button>
              </SignInButton>
            </Show>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

