import {
  markdownStreamerClasses,
  scrollbarClasses,
} from "@/src/app/components/markdown-streamer/constants";
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

interface StyledMarkdownDisplayProps {
  content: string;
}

export default function StyledMarkdownDisplay({
  content,
}: StyledMarkdownDisplayProps) {
  return (
    <div className={cn("prose", markdownStreamerClasses, scrollbarClasses)}>
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
            <div className={cn("w-full overflow-x-auto")}>
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
