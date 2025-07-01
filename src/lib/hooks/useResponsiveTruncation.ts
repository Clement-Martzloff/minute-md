"use client";

import { truncate } from "@/src/lib/utils";
import { useEffect, useState } from "react";

interface BreakpointConfig {
  mobileS: number;
  mobileM: number;
  mobileL: number;
  tablet: number;
  laptop: number;
}

const breakpoints: BreakpointConfig = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 425,
  tablet: 768,
  laptop: 1024,
};

const defaultTruncateLengths = {
  mobileS: 20,
  mobileM: 40,
  mobileL: 60,
  tablet: 80,
  laptop: 100,
};

export function useResponsiveTruncation(
  fileName: string,
  customTruncateLengths?: { [key: string]: number },
): string {
  const mergedTruncateLengths = {
    ...defaultTruncateLengths,
    ...customTruncateLengths,
  };
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const getTruncateLength = (width: number): number => {
    if (width < breakpoints.mobileM) {
      return mergedTruncateLengths.mobileS;
    } else if (width < breakpoints.mobileL) {
      return mergedTruncateLengths.mobileM;
    } else if (width < breakpoints.tablet) {
      return mergedTruncateLengths.mobileL;
    } else if (width < breakpoints.laptop) {
      return mergedTruncateLengths.tablet;
    } else {
      return mergedTruncateLengths.laptop;
    }
  };

  return truncate(fileName, getTruncateLength(windowWidth));
}
