import { GenerateMeetingReportUseCase } from "@/core/usecases/generate-meeting-report";
import { GoogleDriveDocumentRepository } from "@/infrastructure/adapters/google-drive-document-repository";
import { LanggraphMeetingReportGenerator } from "@/infrastructure/adapters/langgraph-meeting-report-generator";
import { LoadDocumentsNode } from "@/infrastructure/framework/langgraph/documents-loader-node";
import { MeetingReportAnnotation } from "@/infrastructure/framework/langgraph/meeting-report-annotation";
import { OAuth2Client } from "google-auth-library";

export class MeetingReportFactory {
  constructor(private oauthClient: OAuth2Client) {}

  public createUseCase(): GenerateMeetingReportUseCase {
    const documentRepository = new GoogleDriveDocumentRepository(
      this.oauthClient
    );
    const loaderNode = new LoadDocumentsNode(documentRepository);
    const reportGenerator = new LanggraphMeetingReportGenerator(
      MeetingReportAnnotation,
      loaderNode
    );

    return new GenerateMeetingReportUseCase(reportGenerator);
  }
}
