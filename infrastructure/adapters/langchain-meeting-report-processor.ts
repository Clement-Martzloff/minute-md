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
    reducer: (_, updateValue) => updateValue,
    default: () => [],
  }),
  failureReason: Annotation<string | undefined>({
    reducer: (_, updateValue) => updateValue,
    default: () => undefined,
  }),
  synthesizedText: Annotation<string | undefined>({
    reducer: (_, updateValue) => updateValue,
    default: () => undefined,
  }),
  meetingReportDraft: Annotation<MeetingReport | undefined>({
    reducer: (_, updateValue) => updateValue,
    default: () => undefined,
  }),
});

export type MeetingReportStateAnnotation = typeof MeetingReportAnnotation.State;

export class LangchainMeetingReportProcessor implements MeetingReportProcessor {
  private app;

  constructor(
    private meetingRelevanceFilter: LangchainNode<MeetingReportStateAnnotation>,
    private meetingDocumentSynthesizer: LangchainNode<MeetingReportStateAnnotation>,
    private meetingReportExtractor: LangchainNode<MeetingReportStateAnnotation>
  ) {
    const workflow = new StateGraph(MeetingReportAnnotation.spec)
      .addNode(
        "relevance_filter",
        this.meetingRelevanceFilter.run.bind(this.meetingRelevanceFilter)
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
      .addEdge(START, "relevance_filter")
      .addConditionalEdges("relevance_filter", (state) => {
        if (state.documents && state.documents.length > 0) {
          return "synthesize_documents";
        }
        return END;
      })
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
    console.log("Final State:", JSON.stringify(finalState, null, 2));

    // 1. Check for success first.
    if (finalState.meetingReportDraft) {
      return {
        status: "success",
        summary: finalState.meetingReportDraft.summary,
        state: finalState,
      };
    }

    // 2. If no success, check for a failure reason.
    if (finalState.failureReason) {
      if (finalState.failureReason.includes("irrelevant")) {
        return {
          status: "irrelevant",
          reason: finalState.failureReason,
          state: finalState,
        };
      }
      // Otherwise, it was a processing error.
      return {
        status: "error",
        reason: finalState.failureReason,
        state: finalState,
      };
    }

    // 3. Fallback for unexpected cases.
    return {
      status: "error",
      reason:
        "Pipeline finished in an unknown state without a report or failure reason.",
      state: finalState,
    };
  }
}
