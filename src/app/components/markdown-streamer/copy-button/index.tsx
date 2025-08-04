"use client";

import CopyButton from "@/src/app/components/markdown-streamer/copy-button/CopyButton";
import { useReportStore } from "@/src/lib/store/useReportStore";
import { useCallback, useState } from "react";

export default function CopyButtonIndex() {
  const [copyButtonLabel, setCopyButtonLabel] = useState("Copier");

  const handleCopy = useCallback(async () => {
    // Get the latest content directly from the store WITHOUT subscribing to it.
    const contentToCopy = useReportStore.getState().markdownContent;

    if (!contentToCopy) return;

    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopyButtonLabel("Copié !");
      setTimeout(() => setCopyButtonLabel("Copier"), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      // Optionally, update the label to show an error
      setCopyButtonLabel("Erreur");
      setTimeout(() => setCopyButtonLabel("Copier"), 2000);
    }
  }, []);

  return <CopyButton onCopy={handleCopy} label={copyButtonLabel} />;
}
