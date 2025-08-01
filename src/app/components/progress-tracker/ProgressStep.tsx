import { AllStepNames, Status } from "@/src/lib/context/types";

const stepLabels: Record<AllStepNames, string> = {
  "documents-relevance-filter": "Analyse de la pertinence",
  "documents-synthesis": "Synthèse des informations",
  "json-report-extraction": "Extraction des données clés",
  "markdown-generation": "Génération du rapport",
  "json-report-translation": "Traduction du rapport",
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
        {failureReason ? failureReason : "Compte-rendu généré"}
      </StepMessage>
    );
  }

  if (!stepName && status === "running") {
    return <StepMessage>Démarrage du pipeline</StepMessage>;
  }

  return (
    <StepMessage>
      {stepName ? stepLabels[stepName] || stepName : ""}
    </StepMessage>
  );
}
