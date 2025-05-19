import { Document } from "@/application/ports/DocumentRepository";
import { GoogleAuthService } from "@/infrastructure/google/google-auth";
import { GoogleDriveRepository } from "@/infrastructure/google/google-drive-repository";
import "server-only";

const auth = await GoogleAuthService.getAuth();
const repository = new GoogleDriveRepository(auth);

export async function listDriveDocumentsServer(): Promise<Document[]> {
  const documents = await repository.listDocuments();

  return documents;
}
