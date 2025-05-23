import { Document } from "@/core/ports/document-repository";
import { ListDocumentsUseCase } from "@/core/usecases/list-documents-usecase";
import { auth } from "@/infrastructure/better-auth/auth";
import { DriveRepository } from "@/infrastructure/google/drive-repository"; // Corrected import path based on open tabs
import { OAuth2ClientFactory } from "@/infrastructure/google/OAuth2-client-factory"; // Import the factory class
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
    throw new Error(
      "Google access token not available. User may not be authenticated or Google account not linked."
    );
  }

  const oauth2Client = OAuth2ClientFactory.createClient(
    accessTokenResponse.accessToken
  );

  const repository = new DriveRepository(oauth2Client);
  const useCase = new ListDocumentsUseCase(repository);

  const documents = await useCase.execute();

  return documents;
}
