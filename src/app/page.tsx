"use client";

import FilesDropzone from "@/src/app/components/files-dropzone";
import GenerateReport from "@/src/app/components/generate-report";
import Hero from "@/src/app/components/Hero";
import MarkdownStreamer from "@/src/app/components/markdown-streamer";
import ProgressTracker from "@/src/app/components/progress-tracker";
import SelectedFiles from "@/src/app/components/selected-files";
import { useEffect, useRef } from "react";

export default function HomePage() {
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!parentRef.current) return;

    const scrollIntoView = () => {
      const lastChild = parentRef.current
        ?.lastElementChild as HTMLElement | null;
      if (lastChild) {
        lastChild.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          console.log("New child added, scrolling into view");
          scrollIntoView();
          break;
        }
      }
    });

    scrollIntoView();

    observer.observe(parentRef.current, {
      childList: true,
      subtree: false,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-4 mt-6 max-w-lg space-y-6 md:mx-auto" ref={parentRef}>
      <Hero />
      <FilesDropzone />
      <SelectedFiles />
      <GenerateReport />
      <ProgressTracker />
      <MarkdownStreamer />
    </div>
  );
}
