import { Button } from "@/src/components/ui/button";
import { Copy } from "lucide-react";

interface MarkdownHeaderProps {
  onCopy: () => void;
  copyButtonLabel: string;
}

export default function CopyButton({
  onCopy,
  copyButtonLabel,
}: MarkdownHeaderProps) {
  return (
    <Button onClick={onCopy} variant="secondary">
      {copyButtonLabel}
      <Copy className="h-4 w-4" />
    </Button>
  );
}
