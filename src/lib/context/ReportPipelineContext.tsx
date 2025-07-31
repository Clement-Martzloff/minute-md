"use client";

import type { FileItem } from "@/src/app/components/files-dropzone/types";
import { PipelineState } from "@/src/lib/context/interfaces";
import { PipelineAction, ProgressEvent } from "@/src/lib/context/types";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

const initialState: PipelineState = {
  sources: [],
  status: "pending",
  elapsedTime: 0,
};

// --- REDUCER ---
function pipelineReducer(
  state: PipelineState,
  action: PipelineAction,
): PipelineState {
  switch (action.type) {
    case "START":
      return {
        ...state,
        status: "running",
        failureReason: undefined,
        stepName: undefined,
        elapsedTime: 0,
      };
    case "STEP_STARTED":
      return { ...state, stepName: action.stepName };
    case "STEP_FINISHED":
      return state;
    case "END_SUCCESS":
      return { ...state, status: "finished" };
    case "END_FAILURE":
      return { ...state, status: "finished", failureReason: action.reason };
    case "SET_SOURCES":
      return { ...state, sources: action.sources };
    case "REMOVE_SOURCE":
      return {
        ...state,
        sources: state.sources.filter((f) => f.id !== action.id),
      };
    case "CLEAR_SOURCES":
      return { ...state, sources: [] };
    case "SET_ELAPSED":
      return { ...state, elapsedTime: action.time };
    default:
      return state;
  }
}

// --- CONTEXTS ---
type ReportFilesContextValue = {
  sources: FileItem[];
  addFiles: (newFiles: FileItem[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
};
export const ReportFilesContext = createContext<
  ReportFilesContextValue | undefined
>(undefined);

type ReportStateContextValue = {
  pipelineState: PipelineState;
  markdownContent: string;
  processFiles: (files: File[]) => Promise<void>;
};
export const ReportStateContext = createContext<
  ReportStateContextValue | undefined
>(undefined);

type ReportTimerContextValue = {
  elapsedTime: number;
};
export const ReportTimerContext = createContext<
  ReportTimerContextValue | undefined
>(undefined);

// --- INTERNAL HOOK ---
function useReportPipelineInternal() {
  const [state, dispatch] = useReducer(pipelineReducer, initialState);
  const [markdown, setMarkdown] = useState("");
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (state.status !== "running") return;

    const tick = () => {
      if (startTimeRef.current !== null) {
        const elapsed = Date.now() - startTimeRef.current;
        dispatch({ type: "SET_ELAPSED", time: elapsed });
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state.status]);

  // Process files
  const processFiles = useCallback(async (files: File[]) => {
    dispatch({ type: "START" });
    setMarkdown("");
    startTimeRef.current = Date.now();

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/api/meeting-report", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        dispatch({ type: "END_FAILURE", reason: error || "Unknown error" });
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No stream reader");

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
            switch (event.type) {
              case "step-start":
                dispatch({ type: "STEP_STARTED", stepName: event.stepName });
                break;
              case "step-end":
                dispatch({ type: "STEP_FINISHED" });
                break;
              case "pipeline-end":
                if (event.status === "success") {
                  dispatch({ type: "END_SUCCESS" });
                } else {
                  dispatch({
                    type: "END_FAILURE",
                    reason: event.failure || "Unknown failure",
                  });
                }
                break;
              case "step-chunk":
                if (
                  event.stepName === "markdown-generation" &&
                  typeof event.chunk === "string"
                ) {
                  setMarkdown((prev) => prev + event.chunk);
                }
                break;
            }
          }
        }
      }
    } catch (err) {
      console.error("Processing failed:", err);
      dispatch({ type: "END_FAILURE", reason: (err as Error).message });
    }
  }, []);

  const addFiles = useCallback(
    (newFiles: FileItem[]) => {
      const currentIds = new Set(state.sources.map((f) => f.id));
      const unique = newFiles
        .filter((f) => !currentIds.has(f.id))
        .map((f) => ({ ...f, selected: true }));
      dispatch({ type: "SET_SOURCES", sources: [...state.sources, ...unique] });
    },
    [state.sources],
  );

  const removeFile = useCallback((id: string) => {
    dispatch({ type: "REMOVE_SOURCE", id });
  }, []);

  const clearFiles = useCallback(() => {
    dispatch({ type: "CLEAR_SOURCES" });
  }, []);

  return {
    state,
    markdown,
    addFiles,
    removeFile,
    clearFiles,
    processFiles,
  };
}

// --- PROVIDER ---
export function ReportPipelineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pipeline = useReportPipelineInternal();

  const filesContextValue = useMemo(
    () => ({
      sources: pipeline.state.sources,
      addFiles: pipeline.addFiles,
      removeFile: pipeline.removeFile,
      clearFiles: pipeline.clearFiles,
    }),
    [
      pipeline.state.sources,
      pipeline.addFiles,
      pipeline.removeFile,
      pipeline.clearFiles,
    ],
  );

  const stateContextValue = useMemo(
    () => ({
      pipelineState: pipeline.state,
      markdownContent: pipeline.markdown,
      processFiles: pipeline.processFiles,
    }),
    [pipeline.state, pipeline.markdown, pipeline.processFiles],
  );

  const timerContextValue = {
    elapsedTime: pipeline.state.elapsedTime,
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
