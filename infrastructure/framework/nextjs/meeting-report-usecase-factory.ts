import { GenerateMeetingReportUseCase } from "@/core/usecases/generate-meeting-report";
import { GoogleDriveDocumentRepository } from "@/infrastructure/adapters/google-drive-document-repository";
import { LanggraphMeetingReportGenerator } from "@/infrastructure/adapters/langgraph-meeting-report-generator";
import { LoadDocumentsNode } from "@/infrastructure/framework/langgraph/documents-loader-node";
import { MeetingReportAnnotationFactory } from "@/infrastructure/framework/langgraph/meeting-report-annotation";
import { OAuth2Client } from "google-auth-library";

export class MeetingReportUseCaseFactory {
  public static create(
    oauthClient: OAuth2Client
  ): GenerateMeetingReportUseCase {
    const repository = new GoogleDriveDocumentRepository(oauthClient);
    const loaderNode = new LoadDocumentsNode(repository);
    const generator = new LanggraphMeetingReportGenerator(
      MeetingReportAnnotationFactory.create(),
      loaderNode
    );

    return new GenerateMeetingReportUseCase(generator);
  }
}
