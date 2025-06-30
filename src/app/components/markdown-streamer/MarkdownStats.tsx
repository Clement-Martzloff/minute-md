interface MarkdownStatsProps {
  content: string;
}

export default function MarkdownStats({ content }: MarkdownStatsProps) {
  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = content.length;
  const lineCount = content.split("\n").length;

  if (!content.trim()) return null;

  return (
    <div className="p-3 bg-cyan-200 border-t-2 border-black">
      <div className="flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-1">
          <span className="font-black text-black">WORDS:</span>
          <span className="bg-white px-2 py-1 border border-black rounded-none font-black text-black">
            {wordCount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-black text-black">CHARS:</span>
          <span className="bg-white px-2 py-1 border border-black rounded-none font-black text-black">
            {charCount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-black text-black">LINES:</span>
          <span className="bg-white px-2 py-1 border border-black rounded-none font-black text-black">
            {lineCount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
