import { GoogleAuth } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/documents.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive",
];

export async function authenticateGoogle(): Promise<GoogleAuth> {
  const auth = new GoogleAuth({
    scopes: SCOPES,
  });

  try {
    await auth.getClient();
    console.log("Google authentication successful.");
  } catch (error) {
    console.error("Google authentication failed:", error);
    throw new Error(
      "Failed to authenticate with Google APIs. Ensure credentials are set up correctly."
    );
  }

  return auth;
}
