import React, { useLayoutEffect, useRef } from "react";

interface RawMarkdownStreamDisplayProps {
  content: string;
}

/**
 * A component that displays streaming raw text and intelligently auto-scrolls.
 * It only scrolls to the bottom if the user was already near the bottom,
 * allowing them to scroll up and read without interruption.
 */
export const RawMarkdownStreamDisplay: React.FC<
  RawMarkdownStreamDisplayProps
> = ({ content }) => {
  const preRef = useRef<HTMLPreElement>(null);

  // We use useLayoutEffect because it runs after the DOM is updated but before the
  // browser paints. This prevents flickering and ensures we have the latest scroll dimensions.
  useLayoutEffect(() => {
    const element = preRef.current;
    if (!element) return;

    // A small buffer to account for sub-pixel rendering.
    const scrollBuffer = 20;

    // Check if the user is scrolled near the bottom before the new content was added.
    // scrollHeight is the total height of the content.
    // scrollTop is the current vertical scroll position.
    // clientHeight is the visible height of the element.
    const isScrolledToBottom =
      element.scrollHeight - element.scrollTop <=
      element.clientHeight + scrollBuffer;

    // If they were at the bottom, keep them at the bottom.
    if (isScrolledToBottom) {
      element.scrollTop = element.scrollHeight;
    }
  }, [content]);

  return (
    <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl mx-auto dark:prose-invert rounded-md border p-6 bg-gray-50 dark:bg-gray-900">
      <pre
        ref={preRef}
        className="whitespace-pre-wrap font-mono text-sm max-h-[60vh] overflow-y-auto"
      >
        <code>{content}</code>
      </pre>
    </div>
  );
};
