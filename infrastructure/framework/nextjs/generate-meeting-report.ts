"use server";

import { MeetingReport } from "@/core/domain/meeting";
import { setupDI } from "@/infrastructure/di/setupDi";
import { auth } from "@/infrastructure/framework/better-auth/auth";
import { GooglePickerDocumentConverter } from "@/infrastructure/google/google-picker-document-converter";
import { headers } from "next/headers";
import "server-only";

type PickerSource = google.picker.DocumentObject & { selected: boolean };

const container = setupDI();

const loadUseCaseFactory = container.resolve("LoadDocumentsUseCaseFactory");
const generateUseCase = container.resolve("GenerateMeetingReportUseCase");

const converter = new GooglePickerDocumentConverter();

export async function generateMeetingReport(
  sources: PickerSource[]
): Promise<MeetingReport> {
  const response = await auth.api.getAccessToken({
    body: { providerId: "google" },
    headers: await headers(),
  });
  if (!response?.accessToken) throw new Error("Access token not available.");

  const accessToken = response.accessToken;

  const initialDocuments = converter.convert(sources);

  const loadUseCase = loadUseCaseFactory.create(accessToken);
  const loadedAndValidatedDocuments = await loadUseCase.execute(
    initialDocuments
  );

  const report = await generateUseCase.execute(loadedAndValidatedDocuments);

  return report;
}
