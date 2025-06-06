import { Document, InvalidDocumentNameError } from "@/core/domain/document";
import { MeetingReport } from "@/core/domain/meeting";
import {
  DocumentsTooLargeError,
  GenerateMeetingReportUseCase,
  TooManyDocumentsError,
} from "@/core/usecases/generate-meeting-report";
import { PickerDocumentConverter } from "@/infrastructure/converters/google/picker-document-converter";
import { auth } from "@/infrastructure/framework/better-auth/auth";
import { OAuth2ClientFactory } from "@/infrastructure/framework/google/OAuth2-client-factory";
import { MeetingReportFactory } from "@/infrastructure/framework/nextjs/meeting-report-factory";
import { headers } from "next/headers";
import "server-only";

type PickerSource = google.picker.DocumentObject & { selected: boolean };

export async function generateMeetingReport(
  sources: PickerSource[]
): Promise<MeetingReport> {
  const accessToken = await getGoogleAccessToken();
  const oauthClient = OAuth2ClientFactory.create(accessToken);

  const documents = convertPickerDocuments(sources);
  const factory = new MeetingReportFactory(oauthClient);
  const useCase = factory.createUseCase();

  return executeReportGeneration(useCase, documents);
}

async function getGoogleAccessToken(): Promise<string> {
  const response = await auth.api.getAccessToken({
    body: { providerId: "google" },
    headers: await headers(),
  });

  if (!response?.accessToken) {
    throw new Error(
      "Google access token not available. User may not be authenticated or Google account not linked."
    );
  }

  return response.accessToken;
}

function convertPickerDocuments(sources: PickerSource[]) {
  const converter = new PickerDocumentConverter();

  try {
    return converter.convert(sources);
  } catch (error) {
    if (error instanceof InvalidDocumentNameError) {
      console.error(`Document conversion failed: ${error.message}`);
      throw new Error(
        "Failed to process selected documents due to invalid data."
      );
    }
    throw error;
  }
}

async function executeReportGeneration(
  useCase: GenerateMeetingReportUseCase,
  documents: Document[]
) {
  try {
    return await useCase.execute(documents);
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
