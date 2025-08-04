import { Button } from "@/src/components/ui/button";

interface CopyButtonProps {
  onCopy: () => void;
  label: string;
}

/**
 * A purely presentational button for copy actions.
 */
export default function CopyButton({ onCopy, label }: CopyButtonProps) {
  return (
    <Button variant="outline" onClick={onCopy} size="sm">
      {label}
    </Button>
  );
}
