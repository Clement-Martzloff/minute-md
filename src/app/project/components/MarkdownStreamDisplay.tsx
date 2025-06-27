import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownStreamDisplayProps {
  content: string;
}

/**
 * A component that renders markdown content.
 * Designed to be updated with streaming content.
 */
export const MarkdownStreamDisplay: React.FC<MarkdownStreamDisplayProps> = ({
  content,
}) => {
  return (
    <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl mx-auto dark:prose-invert rounded-md border p-6">
      <ReactMarkdown
        components={{
          // Optional: Custom renderers for specific elements if needed
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          h1: ({ node: _, ...props }) => (
            <h1 className="text-2xl font-bold mb-4" {...props} />
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          p: ({ node: _, ...props }) => <p className="mb-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
