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
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">{truncatedTitle}</h3>

      <Button onClick={onCopy} variant="secondary">
        {copyButtonLabel}
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
