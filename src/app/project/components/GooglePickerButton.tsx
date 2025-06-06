"use client";

import { useGooglePicker } from "@/src/app/project/hooks/useGooglePicker";
import { useSourcesStore } from "@/src/app/project/store/useSourcesStore";

export default function GooglePickerButton() {
  const { isPickerReady, openPicker } = useGooglePicker();
  const addSources = useSourcesStore((store) => store.addSources);

  return (
    <button
      onClick={() => openPicker(addSources)}
      disabled={!isPickerReady}
      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
    >
      Open Google Picker
    </button>
  );
}
