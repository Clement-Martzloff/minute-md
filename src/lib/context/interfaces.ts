import { FileItem } from "@/src/app/components/files-dropzone/types";
import { AllStepNames, Status } from "@/src/lib/context/types";

export interface PipelineState {
  sources: FileItem[];
  status: Status;
  failureReason?: string;
  stepName?: AllStepNames;
  elapsedTime: number;
}
