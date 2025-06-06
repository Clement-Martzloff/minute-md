import { Document } from "@/core/domain/document";
import { Annotation } from "@langchain/langgraph";

export class MeetingReportAnnotationFactory {
  static create() {
    const MeetingReportAnnotation = Annotation.Root({
      documentIds: Annotation<string[]>({
        reducer: (currentState, updateValue) =>
          currentState.concat(updateValue),
        default: () => [],
      }),
      docs_content: Annotation<Document[]>({
        reducer: (currentState, updateValue) =>
          currentState.concat(updateValue),
        default: () => [],
      }),
    });
    return MeetingReportAnnotation;
  }
}

export type AnnotationState = ReturnType<
  typeof MeetingReportAnnotationFactory.create
>;
