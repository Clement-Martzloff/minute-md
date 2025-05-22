import { GoogleAuth } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/documents.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive",
];

export class GoogleAuthService {
  static async getAuth(): Promise<GoogleAuth> {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!credentialsPath) {
      throw new Error(
        "GOOGLE_APPLICATION_CREDENTIALS environment variable is not set. Please provide the path to your Google API credentials file."
      );
    }

    const auth = new GoogleAuth({
      keyFile: credentialsPath,
      scopes: SCOPES,
    });
    auth.set;

    try {
      // Attempt to get a client to verify authentication
      await auth.getClient();
      console.log("Google authentication successful.");
    } catch (error) {
      console.error("Google authentication failed:", error);
      throw new Error(
        `Failed to authenticate with Google APIs using credentials file at ${credentialsPath}. Ensure the file exists and is valid.`
      );
    }

    return auth;
  }
}
