import { AllStepNames, Status } from "@/src/lib/context/types";

const stepLabels: Record<AllStepNames, string> = {
  "documents-relevance-filter": "Filtering relevant documents",
  "documents-synthesis": "Synthesizing information",
  "json-report-extraction": "Extracting key data",
  "markdown-generation": "Generating the report",
};

interface ProgressStepProps {
  stepName?: AllStepNames;
  status: Status;
  failureReason?: string;
}

function StepMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg p-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{children}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProgressStep({
  stepName,
  status,
  failureReason,
}: ProgressStepProps) {
  if (status === "finished") {
    return (
      <StepMessage>
        {failureReason ? failureReason : "Report generated"}
      </StepMessage>
    );
  }

  if (!stepName && status === "running") {
    return <StepMessage>Starting the pipeline</StepMessage>;
  }

  return (
    <StepMessage>
      {stepName ? stepLabels[stepName] || stepName : ""}
    </StepMessage>
  );
}
