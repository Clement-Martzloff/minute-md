import { Document } from "@/core/domain/document";
import { Annotation } from "@langchain/langgraph";

export const MeetingReportAnnotation = Annotation.Root({
  documents: Annotation<Document[]>({
    reducer: (currentState, updateValue) => {
      const existingIds = new Set(currentState.map((doc) => doc.id));
      const uniqueNewDocs = updateValue.filter(
        (doc) => !existingIds.has(doc.id)
      );
      return currentState.concat(uniqueNewDocs);
    },
    default: () => [],
  }),
  failureReason: Annotation<string | null>({
    reducer: (_, updateValue) => updateValue,
    default: () => null,
  }),
  isRelevant: Annotation<boolean | null>({
    reducer: (_, updateValue) => updateValue,
    default: () => null,
  }),
  summary: Annotation<string>({
    reducer: (_, updateValue) => updateValue,
    default: () => "",
  }),
});

export type MeetingReportStateAnnotation = typeof MeetingReportAnnotation.State;
