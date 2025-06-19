import {
  ProcessingEvent,
  ProcessingRuleError,
} from "@/core/events/processing-events";
import { setupDI } from "@/infrastructure/di/setupDi";
import { auth } from "@/infrastructure/framework/better-auth/auth";
import { headers } from "next/headers";

const container = setupDI();
const parser = container.resolve("GoogleDocumentParser");
const loadUseCaseFactory = container.resolve("LoadDocumentsUseCaseFactory");
const generateUsecase = container.resolve("GenerateMeetingReportUseCase");

export async function POST(request: Request) {
  try {
    const response = await auth.api.getAccessToken({
      body: { providerId: "google" },
      headers: await headers(),
    });
    if (!response?.accessToken) throw new Error("Access token not available.");

    const accessToken = response.accessToken;

    const loadUseCase = loadUseCaseFactory.create({ accessToken });

    const { sources } = await request.json();

    const initialDocuments = parser.parseMultiple(sources);
    const loadedAndValidatedDocuments = await loadUseCase.execute(
      initialDocuments
    );

    // 1. Get the async generator from the use case
    const eventStream = generateUsecase.execute(loadedAndValidatedDocuments);

    // 2. Create a transform stream to format the events as Server-Sent Events (SSE)
    const transformStream = new TransformStream<ProcessingEvent, Uint8Array>({
      transform(event, controller) {
        const encoder = new TextEncoder();
        const dataString = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(dataString));
      },
    });

    // 3. Pipe the use case's output through the SSE formatter
    const readableStream =
      streamFromGenerator(eventStream).pipeThrough(transformStream);

    // 4. Return a streaming response
    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    // This catch block handles errors that occur *before* the stream starts,
    // like JSON parsing errors or the ProcessingRuleError from the use case.
    let errorMessage = "An unexpected server error occurred.";
    let status = 500;

    if (error instanceof ProcessingRuleError) {
      errorMessage = error.message;
      status = 400; // Bad Request for business rule violations
    } else {
      console.error("API Route Setup Error:", error);
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: status,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * A helper utility to convert an AsyncGenerator to a ReadableStream.
 * This handles the logic of pulling from the generator as the stream is consumed.
 */
function streamFromGenerator<T>(gen: AsyncGenerator<T>): ReadableStream<T> {
  return new ReadableStream<T>({
    async pull(controller) {
      const { value, done } = await gen.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
    cancel(reason) {
      // This is called if the client disconnects.
      console.log("Stream canceled by client.", reason);
      // You can call gen.return() or gen.throw() to clean up the generator if needed.
      gen.return(undefined);
    },
  });
}
