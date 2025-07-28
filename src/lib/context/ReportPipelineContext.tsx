"use client";

import { PipelineEnd, PipelineStart } from "@/core/events/generation-events";
import type { FileItem } from "@/src/app/components/files-dropzone/types";
import type {
  AllStepNames,
  PipelineState,
  ProgressEvent,
  ProgressStep,
} from "@/src/app/components/progress-tracker/types";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// --- UTILITY DATA AND FUNCTIONS ---

const stepLabels: Record<AllStepNames, string> = {
  "documents-relevance-filter": "Filtering relevant documents",
  "documents-synthesis": "Synthesizing information",
  "json-report-extraction": "Extracting key data",
  "markdown-generation": "Generating the report",
};

function buildPipelineState(
  events: ProgressEvent[],
  startTimeRef: React.RefObject<number | null>,
): PipelineState {
  if (events.length === 0) {
    startTimeRef.current = null;
    return {
      isRunning: false,
      isFinished: false,
      mainStatus: "Waiting...",
      steps: [],
    };
  }

  const start = events.find(
    (e): e is PipelineStart => e.type === "pipeline-start",
  );
  const end = events.find((e): e is PipelineEnd => e.type === "pipeline-end");

  if (start && !startTimeRef.current) startTimeRef.current = Date.now();

  const started = new Set<AllStepNames>();
  const completed = new Set<AllStepNames>();

  events.forEach((e) => {
    if ("stepName" in e) {
      const name = e.stepName as AllStepNames;
      if (e.type === "step-start") started.add(name);
      if (e.type === "step-end") completed.add(name);
    }
  });

  const steps = Array.from(started).map((name): ProgressStep => {
    const status: "completed" | "running" = completed.has(name)
      ? "completed"
      : "running";

    return { name: stepLabels[name] || name, status };
  });

  if (end) {
    steps.forEach((s) => (s.status = "completed"));
  }

  return {
    isRunning: !!start && !end,
    isFinished: !!end,
    mainStatus: end
      ? end.status === "success"
        ? "Complete"
        : "Failed"
      : "Thinking",
    steps,
  };
}

// --- CONTEXT DEFINITIONS ---

// Context 1: File Management (Low frequency changes)
type ReportFilesContextValue = {
  sources: FileItem[];
  addFiles: (newFiles: FileItem[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
};
export const ReportFilesContext = createContext<
  ReportFilesContextValue | undefined
>(undefined);

// Context 2: Pipeline State & Execution (Medium frequency changes)
type ReportStateContextValue = {
  pipelineState: PipelineState;
  markdownContent: string;
  processFiles: (files: File[]) => Promise<void>;
};
export const ReportStateContext = createContext<
  ReportStateContextValue | undefined
>(undefined);

// Context 3: Timer (High frequency changes)
type ReportTimerContextValue = {
  elapsedTime: number; // in milliseconds
};
export const ReportTimerContext = createContext<
  ReportTimerContextValue | undefined
>(undefined);

// --- INTERNAL "ENGINE" HOOK ---

function useReportPipelineInternal() {
  const [events, setEvents] = useState<ProgressEvent[]>([]);
  const [sources, setSources] = useState<FileItem[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const pipelineState = useMemo(
    () => buildPipelineState(events, startTimeRef),
    [events],
  );

  useEffect(() => {
    const tick = () => {
      if (startTimeRef.current) {
        setElapsed(Date.now() - startTimeRef.current);
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    if (pipelineState.isRunning) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (pipelineState.isFinished && startTimeRef.current) {
        setElapsed(Date.now() - startTimeRef.current);
      }
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pipelineState.isRunning, pipelineState.isFinished]);

  const processFiles = useCallback(async (files: File[]) => {
    setEvents([]);
    setMarkdown("");
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    try {
      const res = await fetch("/api/meeting-report", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        console.error("API error:", await res.json());
        return;
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No stream reader found.");
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunks = decoder
          .decode(value, { stream: true })
          .split("\n\n")
          .filter(Boolean);
        for (const chunk of chunks) {
          if (chunk.startsWith("data: ")) {
            const event: ProgressEvent = JSON.parse(chunk.slice(6));
            setEvents((prev) => [...prev, event]);
            if (
              event.type === "step-chunk" &&
              event.stepName === "markdown-generation" &&
              typeof event.chunk === "string"
            ) {
              setMarkdown((prev) => prev + event.chunk);
            }
          }
        }
      }
    } catch (err) {
      console.error("File processing failed:", err);
    }
  }, []);

  const addFiles = useCallback(
    (newFiles: FileItem[]) => {
      if (pipelineState.isFinished) {
        setEvents([]);
        setMarkdown("");
      }
      setSources((prev) => {
        const ids = new Set(prev.map((f) => f.id));
        return [
          ...prev,
          ...newFiles
            .filter((f) => !ids.has(f.id))
            .map((f) => ({ ...f, selected: true })),
        ];
      });
    },
    [pipelineState.isFinished],
  );

  const removeFile = useCallback(
    (id: string) => {
      if (pipelineState.isFinished) {
        setEvents([]);
        setMarkdown("");
      }
      setSources((prev) => prev.filter((f) => f.id !== id));
    },
    [pipelineState.isFinished],
  );

  const clearFiles = useCallback(() => setSources([]), []);

  return {
    sources,
    markdownContent: markdown,
    pipelineState,
    elapsedTime: elapsed,
    addFiles,
    removeFile,
    clearFiles,
    processFiles,
  };
}

// --- MAIN PROVIDER ---

export function ReportPipelineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pipeline = useReportPipelineInternal();

  // Memoize context values to prevent re-renders for consumers
  // when unrelated parts of the state change.
  const filesContextValue = useMemo(
    () => ({
      sources: pipeline.sources,
      addFiles: pipeline.addFiles,
      removeFile: pipeline.removeFile,
      clearFiles: pipeline.clearFiles,
    }),
    [
      pipeline.sources,
      pipeline.addFiles,
      pipeline.removeFile,
      pipeline.clearFiles,
    ],
  );

  const stateContextValue = useMemo(
    () => ({
      pipelineState: pipeline.pipelineState,
      markdownContent: pipeline.markdownContent,
      processFiles: pipeline.processFiles,
    }),
    [pipeline.pipelineState, pipeline.markdownContent, pipeline.processFiles],
  );

  // The timer value is intentionally not memoized as it's expected to change every frame.
  const timerContextValue = {
    elapsedTime: pipeline.elapsedTime,
  };

  return (
    <ReportFilesContext.Provider value={filesContextValue}>
      <ReportStateContext.Provider value={stateContextValue}>
        <ReportTimerContext.Provider value={timerContextValue}>
          {children}
        </ReportTimerContext.Provider>
      </ReportStateContext.Provider>
    </ReportFilesContext.Provider>
  );
}
