import { Document } from "@/core/ports/DocumentRepository";
import { ListDocumentsUseCase } from "@/core/usecases/ListDocumentsUseCase";
import { GoogleAuthService } from "@/infrastructure/google/google-auth";
import { GoogleDriveRepository } from "@/infrastructure/google/google-drive-repository";
import "server-only";

const auth = await GoogleAuthService.getAuth();
const repository = new GoogleDriveRepository(auth);
const useCase = new ListDocumentsUseCase(repository);

export async function listDocuments(): Promise<Document[]> {
  const documents = await useCase.execute();

  return documents;
}
