import { InvalidDocumentNameError } from "@/core/domain/document";
import { MeetingReport } from "@/core/domain/meeting";
import {
  DocumentsTooLargeError,
  GenerateMeetingReportUseCase,
  TooManyDocumentsError,
} from "@/core/usecases/generate-meeting-report";
import { GoogleDriveDocumentRepository } from "@/infrastructure/adapters/google-drive-document-repository";
import { LanggraphMeetingReportGenerator } from "@/infrastructure/adapters/langgraph-meeting-report-generator";
import { PickerDocumentConverter } from "@/infrastructure/converters/google/picker-document-converter";
import { auth } from "@/infrastructure/framework/better-auth/auth";
import { OAuth2ClientFactory } from "@/infrastructure/framework/google/OAuth2-client-factory";
import { LoadDocumentsNode } from "@/infrastructure/langgraph/documents-loader-node";
import { MeetingReportAnnotation } from "@/infrastructure/langgraph/meeting-report-annotation";
import { headers } from "next/headers";
import "server-only";

export async function generateMeetingReportFromSources(
  sources: (google.picker.DocumentObject & { selected: boolean })[]
): Promise<MeetingReport> {
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

  const oauth2Client = OAuth2ClientFactory.create(
    accessTokenResponse.accessToken
  );
  const googleDriveDocumentRepository = new GoogleDriveDocumentRepository(
    oauth2Client
  );
  const loadDocumentsNode = new LoadDocumentsNode(
    googleDriveDocumentRepository
  );
  const langgraphMeetingReportGenerator = new LanggraphMeetingReportGenerator(
    MeetingReportAnnotation,
    loadDocumentsNode
  );
  const generateMeetingReportUseCase = new GenerateMeetingReportUseCase(
    langgraphMeetingReportGenerator
  );
  const pickerDocumentConverter = new PickerDocumentConverter();
  let documents;

  try {
    documents = pickerDocumentConverter.convert(sources);
  } catch (error) {
    if (error instanceof InvalidDocumentNameError) {
      console.error(`Document conversion failed: ${error.message}`);
      throw new Error(
        "Failed to process selected documents due to invalid data."
      );
    }
    throw error;
  }

  try {
    return await generateMeetingReportUseCase.execute(documents);
  } catch (error) {
    if (
      error instanceof TooManyDocumentsError ||
      error instanceof DocumentsTooLargeError
    ) {
      console.error(`Meeting report generation failed: ${error.message}`);
      throw new Error(`Failed to generate report: ${error.message}`);
    }
    throw error;
  }
}
