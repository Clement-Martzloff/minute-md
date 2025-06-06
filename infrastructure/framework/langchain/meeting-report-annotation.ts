import { Document } from "@/core/domain/document";
import { Annotation } from "@langchain/langgraph";

export class MeetingReportAnnotationFactory {
  static create() {
    const MeetingReportAnnotation = Annotation.Root({
      document_ids: Annotation<string[]>({
        reducer: (currentState, updateValue) =>
          Array.from(new Set([...currentState, ...updateValue])),
        default: () => [],
      }),
      docs_content: Annotation<Document[]>({
        reducer: (currentState, updateValue) =>
          currentState.concat(updateValue),
        default: () => [],
      }),
      summary: Annotation<string>({
        reducer: (_, updateValue) => updateValue,
        default: () => "",
      }),
    });

    return MeetingReportAnnotation;
  }
}

export type Annotation = ReturnType<
  typeof MeetingReportAnnotationFactory.create
>;
