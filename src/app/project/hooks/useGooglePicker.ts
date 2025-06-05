"use client";

import { authClient } from "@/infrastructure/framework/better-auth/auth-client";
import { useCallback, useEffect, useState } from "react";

interface UseGooglePickerResult {
  isPickerReady: boolean;
  openPicker: (
    onDocumentObjectsSelected: (docs: google.picker.DocumentObject[]) => void
  ) => Promise<void>;
}

export function useGooglePicker(): UseGooglePickerResult {
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.gapi.load("picker", () => {
        setPickerApiLoaded(true);
      });
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openPicker = useCallback(
    async (
      onDocumentObjectsSelected: (docs: google.picker.DocumentObject[]) => void
    ) => {
      if (!pickerApiLoaded) {
        console.error("Google Picker API not loaded.");
        return;
      }

      const { data: accessTokenResponse, error } =
        await authClient.getAccessToken({
          providerId: "google",
        });

      if (error || !accessTokenResponse?.accessToken) {
        console.error("Failed to get Google access token:", error);
        return;
      }

      const picker = new google.picker.PickerBuilder()
        .setAppId("office-bot-460408") // public, optional but required for some scopes
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_PICKER_DEVELOPER_KEY!)
        .setOAuthToken(accessTokenResponse.accessToken)
        .addView(
          new google.picker.DocsView(google.picker.ViewId.DOCUMENTS)
            .setIncludeFolders(true)
            .setMode(google.picker.DocsViewMode.LIST)
        )
        .setCallback((data: google.picker.ResponseObject) => {
          if (data.action === google.picker.Action.PICKED && data.docs) {
            onDocumentObjectsSelected(data.docs);
          }
        })
        .build();

      picker.setVisible(true);
    },
    [pickerApiLoaded]
  );

  return {
    isPickerReady: pickerApiLoaded,
    openPicker,
  };
}
