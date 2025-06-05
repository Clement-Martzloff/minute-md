"use client";

import { useGooglePicker } from "@/src/app/project/hooks/useGooglePicker";

interface GooglePickerButtonProps {
  addSources: (documentObjects: google.picker.DocumentObject[]) => void;
}

export default function GooglePickerButton({
  addSources,
}: GooglePickerButtonProps) {
  const { isPickerReady, openPicker } = useGooglePicker();

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
