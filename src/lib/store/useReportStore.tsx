"use client";

import type { FileItem } from "@/src/app/components/files-dropzone/types";
import { PipelineState } from "@/src/lib/store/interfaces";
import { ProgressEvent } from "@/src/lib/store/types";
import { create } from "zustand";

interface ReportStore extends PipelineState {
  markdownContent: string;
  addFiles: (newFiles: FileItem[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  processFiles: (files: File[]) => Promise<void>;
}

export const useReportStore = create<ReportStore>((set, get) => ({
  // --- INITIAL STATE ---
  sources: [],
  status: "pending",
  elapsedTime: 0,
  stepName: undefined,
  failureReason: undefined,
  markdownContent: "",

  // --- ACTIONS ---
  addFiles: (newFiles) => {
    const currentIds = new Set(get().sources.map((f) => f.id));
    const uniqueFiles = newFiles
      .filter((f) => !currentIds.has(f.id))
      .map((f) => ({ ...f, selected: true }));
    set((state) => ({ sources: [...state.sources, ...uniqueFiles] }));
  },

  removeFile: (id) => {
    set((state) => ({
      sources: state.sources.filter((f) => f.id !== id),
    }));
  },

  clearFiles: () => set({ sources: [] }),

  processFiles: async (files) => {
    let rafId: number | null = null;
    const startTime = Date.now();

    const tick = () => {
      set({ elapsedTime: Date.now() - startTime });
      rafId = requestAnimationFrame(tick);
    };

    set({
      status: "running",
      failureReason: undefined,
      stepName: undefined,
      elapsedTime: 0,
      markdownContent: "",
    });
    tick();

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/meeting-report", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Unknown server error");
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
            try {
              const event: ProgressEvent = JSON.parse(chunk.slice(6));
              switch (event.type) {
                case "step-start":
                  set({ stepName: event.stepName });
                  break;
                case "pipeline-end":
                  if (event.status === "success") {
                    set({ status: "finished" });
                  } else {
                    set({
                      status: "finished",
                      failureReason: event.failure || "Unknown failure",
                    });
                  }
                  break;
                case "step-chunk":
                  if (
                    event.stepName === "markdown-generation" &&
                    typeof event.chunk === "string"
                  ) {
                    set((state) => ({
                      markdownContent: state.markdownContent + event.chunk,
                    }));
                  }
                  break;
              }
            } catch (e) {
              console.warn("Could not parse stream chunk:", chunk, e);
            }
          }
        }
      }

      if (get().status === "running") {
        set({ status: "finished" });
      }
    } catch (err) {
      console.error("Processing failed:", err);
      set({ status: "finished", failureReason: (err as Error).message });
    } finally {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    }
  },
}));
