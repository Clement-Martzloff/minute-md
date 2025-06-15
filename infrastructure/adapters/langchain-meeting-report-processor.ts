import { Document } from "@/core/domain/document";
import { MeetingReport } from "@/core/domain/meeting";
import {
  MeetingReportProcessingResult,
  MeetingReportProcessor,
} from "@/core/ports/meeting-report-processor";
import { LangchainNode } from "@/infrastructure/framework/langchain/types";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";

const MeetingReportAnnotation = Annotation.Root({
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
  meetingReportDraft: Annotation<MeetingReport | null>({
    reducer: (_, updateValue) => updateValue,
    default: () => null,
  }),
  synthesizedText: Annotation<string | null>({
    reducer: (_, updateValue) => updateValue,
    default: () => null,
  }),
});

export type MeetingReportStateAnnotation = typeof MeetingReportAnnotation.State;

export class LangchainMeetingReportProcessor implements MeetingReportProcessor {
  private app;

  constructor(
    private meetingRelevanceCheck: LangchainNode<MeetingReportStateAnnotation>,
    private meetingDocumentSynthesizer: LangchainNode<MeetingReportStateAnnotation>,
    private meetingReportExtractor: LangchainNode<MeetingReportStateAnnotation>
  ) {
    const workflow = new StateGraph<typeof MeetingReportAnnotation.spec>(
      MeetingReportAnnotation
    )
      .addNode(
        "relevance_check",
        this.meetingRelevanceCheck.run.bind(this.meetingRelevanceCheck)
      )
      .addNode(
        "synthesize_documents",
        this.meetingDocumentSynthesizer.run.bind(
          this.meetingDocumentSynthesizer
        )
      )
      .addNode(
        "extract_meeting_report",
        this.meetingReportExtractor.run.bind(this.meetingReportExtractor)
      )
      .addEdge(START, "relevance_check")
      .addConditionalEdges(
        "relevance_check",
        (state) => (state.isRelevant ? "synthesize_documents" : END),
        { synthesize_documents: "synthesize_documents", [END]: END }
      )
      .addEdge("synthesize_documents", "extract_meeting_report")
      .addEdge("extract_meeting_report", END);

    this.app = workflow.compile();
  }

  public async process(
    documents: Document[]
  ): Promise<MeetingReportProcessingResult> {
    console.log("LangGraph Processor: Starting pipeline...");

    const finalState = await this.app.invoke({ documents });

    console.log("LangGraph Processor: Pipeline finished.");

    if (finalState.isRelevant === false) {
      return {
        status: "irrelevant",
        reason:
          finalState.failureReason || "Documents were deemed not relevant.",
        state: finalState,
      };
    }

    return {
      status: "error",
      reason:
        finalState.failureReason ||
        "Pipeline completed but failed to generate a report draft.",
      state: finalState,
    };
  }
}
