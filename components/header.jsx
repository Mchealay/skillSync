import React from "react";
import Link from "next/link";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import HeaderActions from "./header-actions";

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

        {/* Auth-conditional actions rendered client-side to avoid hydration mismatch */}
        <HeaderActions />
      </nav>
    </header>
  );
}
