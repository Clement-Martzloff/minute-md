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
        "bg-background/80 fixed top-0 right-0 left-0 z-50 p-4 transition-all duration-300",
        isScrolled ? "backdrop-blur-md" : "backdrop-blur-sm",
      )}
    >
      <div className="flex max-w-xl items-center justify-between md:mx-auto">
        <div className="scroll-m-20 text-xl font-semibold tracking-tight">
          Minute.md
        </div>
        <nav>
          <Link
            href="https://github.com/Clement-Martzloff/office-bot"
            className="text-primary underline hover:no-underline"
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
