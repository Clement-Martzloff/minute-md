import { Button } from "@/src/components/ui/button";
import { useResponsiveTruncation } from "@/src/lib/hooks/useResponsiveTruncation";
import { Copy } from "lucide-react";

interface MarkdownHeaderProps {
  title?: string;
  onCopy: () => void;
  copyButtonLabel: string;
}

export default function MarkdownHeader({
  title = "AI Report",
  onCopy,
  copyButtonLabel,
}: MarkdownHeaderProps) {
  const truncatedTitle = useResponsiveTruncation(title, {
    mobileS: 15,
    mobileM: 40,
    mobileL: 60,
  });

  return (
    <div className="flex items-center justify-between border-b-4 border-black bg-purple-300 p-4">
      <h3 className="text-xl font-bold tracking-tight text-black">
        {truncatedTitle}
      </h3>

      <Button
        onClick={onCopy}
        className="cursor-pointer rounded-none border-2 border-black bg-white font-bold text-black shadow-[3px_3px_0px_0px_#000] transition-all duration-200 hover:bg-white hover:shadow-[4px_4px_0px_0px_#000]"
      >
        <Copy className="h-4 w-4" strokeWidth={3} />
        {copyButtonLabel}
      </Button>
    </div>
  );
}
