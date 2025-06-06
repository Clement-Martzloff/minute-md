"use server";

import { InvalidDocumentNameError } from "@/core/domain/document";
import {
  DocumentsTooLargeError,
  TooManyDocumentsError,
} from "@/core/usecases/generate-meeting-report";
import { auth } from "@/infrastructure/framework/better-auth/auth";
import { MeetingReportUseCaseFactory } from "@/infrastructure/framework/nextjs/meeting-report-usecase-factory";
import { GoogleOAuth2ClientFactory } from "@/infrastructure/google/google-oauth2-client-factory";
import { GooglePickerDocumentConverter } from "@/infrastructure/google/google-picker-document-converter";
import { headers } from "next/headers";
import "server-only";

type PickerSource = google.picker.DocumentObject & { selected: boolean };

export async function generateMeetingReport(
  sources: PickerSource[]
  // ): Promise<MeetingReport> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const response = await auth.api.getAccessToken({
    body: { providerId: "google" },
    headers: await headers(),
  });

  if (!response?.accessToken) {
    throw new Error(
      "Google access token not available. User may not be authenticated or Google account not linked."
    );
  }

  let documents;
  const converter = new GooglePickerDocumentConverter();

  try {
    documents = converter.convert(sources);
  } catch (error) {
    if (error instanceof InvalidDocumentNameError) {
      console.error(`Document conversion failed: ${error.message}`);
      throw new Error(
        "Failed to process selected documents due to invalid data."
      );
    }
    throw error;
  }

  const oauthClient = GoogleOAuth2ClientFactory.create(response.accessToken);
  const useCase = MeetingReportUseCaseFactory.create(oauthClient);

  try {
    useCase.execute(documents);
    return {};
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
