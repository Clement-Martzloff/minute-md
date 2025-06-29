"use client";

import { useGooglePicker } from "@/src/app/project/hooks/useGooglePicker";
import { useSourcesStore } from "@/src/app/project/store/useSourcesStore";
import { Button } from "@/src/components/ui/button";

export default function GooglePickerButton() {
  const { isPickerReady, openPicker } = useGooglePicker();
  const addSources = useSourcesStore((store) => store.addSources);

  return (
    <Button
      onClick={() => openPicker(addSources)}
      disabled={!isPickerReady}
      className="min-w-[120px] mx-auto"
    >
      Open Google Picker
    </Button>
  );
}
