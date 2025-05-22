import { Document } from "@/core/ports/document-repository";
import { ListDocumentsUseCase } from "@/core/usecases/list-documents-usecase";
import { auth } from "@/infrastructure/better-auth/auth";
import { GoogleDriveRepository } from "@/infrastructure/google/google-drive-repository";
import { OAuth2Client } from "google-auth-library";
import { headers } from "next/headers";
import "server-only";

export async function listDocuments(): Promise<Document[]> {
  const accessTokenResponse = await auth.api.getAccessToken({
    body: {
      providerId: "google",
    },
    headers: await headers(),
  });

  if (!accessTokenResponse || !accessTokenResponse.accessToken) {
    // Handle case where access token is not available
    // This could mean the user is not logged in or hasn't linked their Google account
    throw new Error(
      "Google access token not available. User may not be authenticated or Google account not linked."
    );
  }

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
    process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret
    process.env.GOOGLE_REDIRECT_URI // Your Google Redirect URI
  );

  oauth2Client.setCredentials({
    access_token: accessTokenResponse.accessToken,
    // refreshToken is not available directly from getAccessToken based on the error
    expiry_date: accessTokenResponse.accessTokenExpiresAt
      ? accessTokenResponse.accessTokenExpiresAt.getTime()
      : undefined, // Get time in milliseconds from Date object
  });

  const repository = new GoogleDriveRepository(oauth2Client);
  const useCase = new ListDocumentsUseCase(repository);

  const documents = await useCase.execute();

  return documents;
}
