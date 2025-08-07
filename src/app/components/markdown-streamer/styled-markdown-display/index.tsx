"use client";

import StyledMarkdownDisplay from "@/src/app/components/markdown-streamer/styled-markdown-display/StyledMarkdownDisplay";
import { useReportStore } from "@/src/lib/store/useReportStore";

export default function StyledarkdownDisplayIndex() {
  const content = useReportStore.getState().markdownContent;

  return <StyledMarkdownDisplay content={content} />;
}
