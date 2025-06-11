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
  summary: Annotation<string>({
    reducer: (_, updateValue) => updateValue,
    default: () => "",
  }),
});

export type MeetingReportStateAnnotation = typeof MeetingReportAnnotation.State;
