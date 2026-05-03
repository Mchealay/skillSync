"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function HeaderWrapper({ children }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-white/10 py-2 shadow-lg" 
          : "bg-transparent py-4"
      )}
    >
      {children}
    </header>
  );
}
