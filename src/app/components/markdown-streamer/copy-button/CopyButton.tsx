import { Button } from "@/src/components/ui/button";

interface CopyButtonProps {
  onCopy: () => void;
  label: string;
}

export default function CopyButton({ onCopy, label }: CopyButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onCopy}
      size="sm"
      className="cursor-pointer"
    >
      {label}
    </Button>
  );
}
