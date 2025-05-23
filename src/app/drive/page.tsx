"use client";

import { authClient } from "@/infrastructure/better-auth/auth-client";
import { useEffect, useState } from "react";

export default function DrivePage() {
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const { data: session, isPending: sessionPending } = authClient.useSession();

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

  const openGooglePicker = async () => {
    if (!pickerApiLoaded) {
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
      throw new Error(
        "Google access token not available. User may not be authenticated or Google account not linked."
      );
    }

    const picker = new window.google.picker.PickerBuilder()
      .setAppId("office-bot-460408") // ⚠️ public project id
      .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
      .setDeveloperKey("AIzaSyD0NjpzGwQvRqAzAoRpDkBXsGlfdnMEWBg") // ⚠️ public api key
      .setOAuthToken(accessTokenResponse.accessToken)
      .addView(
        new window.google.picker.DocsView(window.google.picker.ViewId.DOCUMENTS)
          .setIncludeFolders(true)
          .setMode(window.google.picker.DocsViewMode.LIST)
      )
      .setCallback((data) => {
        console.table(data.docs);
      })
      .build();
    picker.setVisible(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Google Drive Documents</h1>
      <button
        onClick={openGooglePicker}
        disabled={!pickerApiLoaded || sessionPending || !session}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Open Google Picker
      </button>
    </div>
  );
}
