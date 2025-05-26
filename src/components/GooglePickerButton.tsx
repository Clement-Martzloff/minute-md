"use client";

import { authClient } from "@/infrastructure/better-auth/auth-client";
import { useGooglePickerLoader } from "@/src/hooks/useGooglePickerLoader";
import { type DriveFile } from "../types/drive";

interface GooglePickerButtonProps {
  addSources: (files: DriveFile[]) => void;
}

export default function GooglePickerButton({
  addSources,
}: GooglePickerButtonProps) {
  const { isPickerApiLoaded, openPicker } = useGooglePickerLoader();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const handleOpenPicker = async () => {
    if (!isPickerApiLoaded) {
      console.log("Google Picker API not loaded yet.");
      return;
    }

    if (sessionPending) {
      console.log("Session data is still loading.");
      return;
    }

    const { data: accessTokenResponse } = await authClient.getAccessToken({
      providerId: "google",
    });

    if (!accessTokenResponse || !accessTokenResponse.accessToken) {
      console.error(
        "Google access token not available. User may not be authenticated or Google account not linked."
      );
      return;
    }

    openPicker(accessTokenResponse.accessToken, (files) => {
      addSources(files);
    });
  };

  const isDisabled = !isPickerApiLoaded || sessionPending || !session;

  return (
    <button
      onClick={handleOpenPicker}
      disabled={isDisabled}
      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
    >
      Open Google Picker
    </button>
  );
}
