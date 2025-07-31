import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { cn } from "@/src/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { scrollbarClasses } from "./constants";

interface StyledMarkdownDisplayProps {
  content: string;
  className?: string;
}

export default function StyledMarkdownDisplay({
  content,
  className = "",
}: StyledMarkdownDisplayProps) {
  return (
    <div
      className={cn(
        "bg-primary-foreground h-96 overflow-y-auto rounded-md border p-4",
        "prose",
        scrollbarClasses,
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter style={dark} language={match[1]} PreTag="div">
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="break-words" {...rest}>
                {children}
              </code>
            );
          },
          h1: ({ ...props }) => <h1 {...props} />,
          h2: ({ ...props }) => <h2 {...props} />,
          h3: ({ ...props }) => <h3 {...props} />,
          p: ({ ...props }) => <p {...props} />,
          ul: ({ ...props }) => <ul {...props} />,
          ol: ({ ...props }) => <ol {...props} />,
          li: ({ ...props }) => <li {...props} />,
          a: ({ ...props }) => <a {...props} />,
          blockquote: ({ ...props }) => <blockquote {...props} />,
          table: ({ ...props }) => (
            <div className={cn("w-full overflow-x-auto", scrollbarClasses)}>
              <div className="min-w-md">
                <Table {...props} />
              </div>
            </div>
          ),
          thead: ({ ...props }) => <TableHeader {...props} />,
          tbody: ({ ...props }) => <TableBody {...props} />,
          tr: ({ ...props }) => <TableRow {...props} />,
          th: ({ ...props }) => <TableHead {...props} />,
          td: ({ ...props }) => (
            <TableCell
              className="align-top break-words whitespace-pre-wrap"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
