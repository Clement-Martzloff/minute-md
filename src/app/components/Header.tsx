"use client";

import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 border-b-4 border-black p-4 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md"
          : "bg-white/60 backdrop-blur-sm",
      )}
    >
      <div className="flex max-w-2xl items-center justify-between md:mx-auto md:w-full">
        <div className="text-2xl font-bold text-gray-800">Office Bot</div>
        <nav>
          <Link
            href="https://github.com/Clement-Martzloff/office-bot"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
