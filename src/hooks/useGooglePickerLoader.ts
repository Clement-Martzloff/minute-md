import { useCallback, useEffect, useState } from "react";
import { type DriveFile } from "../types/drive";

interface UseGooglePickerLoaderResult {
  isPickerApiLoaded: boolean;
  openPicker: (
    accessToken: string,
    onFilesSelected: (files: DriveFile[]) => void
  ) => void;
}

export function useGooglePickerLoader(): UseGooglePickerLoaderResult {
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
    (accessToken: string, onFilesSelected: (files: DriveFile[]) => void) => {
      if (!pickerApiLoaded) {
        console.error("Google Picker API not loaded yet.");
        return;
      }

      if (!accessToken) {
        console.error("Access token is not available.");
        return;
      }

      const picker = new window.google.picker.PickerBuilder()
        .setAppId("office-bot-460408") // ⚠️ public project id
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setDeveloperKey("AIzaSyD0NjpzGwQvRqAzAoRpDkBXsGlfdnMEWBg") // ⚠️ public api key
        .setOAuthToken(accessToken)
        .addView(
          new window.google.picker.DocsView(
            window.google.picker.ViewId.DOCUMENTS
          )
            .setIncludeFolders(true)
            .setMode(window.google.picker.DocsViewMode.LIST)
        )
        .setCallback((data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const files = Array.isArray(data.docs)
              ? data.docs.map((doc) => ({
                  id: doc.id,
                  name: doc.name,
                  mimeType: doc.mimeType,
                  iconLink: doc.iconUrl,
                  webViewLink: doc.url,
                  selected: true,
                }))
              : [];
            onFilesSelected(files);
          }
        })
        .build();
      picker.setVisible(true);
    },
    [pickerApiLoaded]
  );

  return { isPickerApiLoaded: pickerApiLoaded, openPicker };
}
