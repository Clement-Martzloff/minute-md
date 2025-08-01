import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";

interface GenerateReportButtonProps {
  isRunning: boolean;
  handleProcessFiles: () => void;
}

export default function GenerateReportButton({
  isRunning,
  handleProcessFiles,
}: GenerateReportButtonProps) {
  return (
    <div className="flex">
      <Button
        className="w-full cursor-pointer md:w-fit"
        onClick={handleProcessFiles}
        size="lg"
        disabled={isRunning}
      >
        <span className="font-semibold tracking-wide">
          {isRunning ? "Traitement..." : "Créer le compte rendu"}
        </span>
        <ArrowRight />
      </Button>
    </div>
  );
}
