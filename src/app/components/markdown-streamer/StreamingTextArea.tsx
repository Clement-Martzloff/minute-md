"use client";

import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area"; // Step 1: Import
import { cn } from "@/src/lib/utils";
import { useEffect, useRef } from "react";

// This is a type helper to get the correct type for the ref
type ScrollAreaElement = React.ComponentRef<typeof ScrollArea>;

interface StreamingTextAreaProps {
  content: string;
  className?: string;
}

export default function StreamingTextArea({
  content,
  className = "",
}: StreamingTextAreaProps) {
  // Step 5: The ref now points to the ScrollArea component's root element
  const scrollAreaRef = useRef<ScrollAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    // We need to find the viewport element within the ScrollArea component
    if (scrollAreaRef.current) {
      // Radix UI (which shadcn/ui uses) adds a predictable data-attribute to the viewport
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );

      if (viewport) {
        const { scrollHeight, clientHeight } = viewport;

        // Only scroll to bottom if content exceeds container height
        if (scrollHeight > clientHeight) {
          viewport.scrollTop = scrollHeight;
        }
      }
    }
  }, [content]);

  return (
    // Step 3 & 4: Apply layout and custom scrollbar styles to ScrollArea
    <ScrollArea
      ref={scrollAreaRef}
      className={cn(
        "bg-primary-foreground h-96 rounded-md border", // Layout and background classes
        "[&::-webkit-scrollbar]:w-2", // Scrollbar width
        "[&::-webkit-scrollbar-track]:rounded-full", // Track styles
        "[&::-webkit-scrollbar-track]:bg-secondary",
        "[&::-webkit-scrollbar-thumb]:rounded-full", // Thumb styles
        "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50",
        "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/80", // Thumb hover styles
        className, // Allow for external class overrides
      )}
    >
      <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
        <code>{content}</code>
      </pre>

      {/* This is the visible scrollbar component from shadcn/ui */}
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
