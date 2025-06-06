import { Document } from "@/core/domain/document";
import { Annotation } from "@langchain/langgraph";

export const MeetingReportAnnotation = Annotation.Root({
  documentIds: Annotation<string[]>({
    reducer: (currentState, updateValue) => currentState.concat(updateValue),
    default: () => [],
  }),
  docs_content: Annotation<Document[]>({
    reducer: (currentState, updateValue) => currentState.concat(updateValue),
    default: () => [],
  }),
});

export type AnnotationState = typeof MeetingReportAnnotation.State;
