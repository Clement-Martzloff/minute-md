"use client";

import CopyButton from "@/src/app/components/markdown-streamer/copy-button/CopyButton";
import { useReportStore } from "@/src/lib/store/useReportStore";
import { useCallback, useState } from "react";

export default function CopyButtonIndex() {
  const [copyButtonLabel, setCopyButtonLabel] = useState("Copier");

  const handleCopy = useCallback(async () => {
    const contentToCopy = useReportStore.getState().markdownContent;

    if (!contentToCopy) return;

    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopyButtonLabel("Copié !");
      setTimeout(() => setCopyButtonLabel("Copier"), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);

      setCopyButtonLabel("Erreur");
      setTimeout(() => setCopyButtonLabel("Copier"), 2000);
    }
  }, []);

  return <CopyButton onCopy={handleCopy} label={copyButtonLabel} />;
}
