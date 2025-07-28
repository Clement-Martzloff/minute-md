"use client";

import { PipelineEnd, PipelineStart } from "@/core/events/generation-events";
import type { FileItem } from "@/src/app/components/file-uploader/types";
import type {
  AllStepNames,
  PipelineState,
  ProgressEvent,
  ProgressStep,
} from "@/src/app/components/progress-tracker/types";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

    return {
      name: stepLabels[name] || name,
      status,
    };
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

  // Track elapsed time
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
    events,
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

export type UseReportPipelineReturn = ReturnType<
  typeof useReportPipelineInternal
>;

const ReportPipelineContext = createContext<
  UseReportPipelineReturn | undefined
>(undefined);

export function ReportPipelineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pipeline = useReportPipelineInternal();
  return (
    <ReportPipelineContext.Provider value={pipeline}>
      {children}
    </ReportPipelineContext.Provider>
  );
}

export function useReportPipeline() {
  const context = useContext(ReportPipelineContext);
  if (!context) {
    throw new Error(
      "useReportPipeline must be used within a ReportPipelineProvider",
    );
  }
  return context;
}
