import { GenerationEvent } from "@/core/events/generation-events";
import { setupDI } from "@/infrastructure/di/setupDi";
import { FileItem } from "@/src/app/project/components/file-uploader/types";

const container = setupDI();
const processUploadedDocumentsUseCase = container.resolve(
  "ProcessUploadedDocumentsUseCase"
);
const generateUsecase = container.resolve("GenerateMeetingReportUseCase");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files: FileItem[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === "files" && value instanceof Blob) {
        const file = value as File;

        files.push({
          id: file.name + file.size + file.lastModified, // Simple unique ID
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
        });
      }
    }

    const loadedAndValidatedDocuments =
      await processUploadedDocumentsUseCase.execute(files);

    // 1. Get the async generator from the use case
    const eventStream = generateUsecase.execute(loadedAndValidatedDocuments);

    // 2. Create a transform stream to format the events as Server-Sent Events (SSE)
    const transformStream = new TransformStream<GenerationEvent, Uint8Array>({
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // This catch block handles errors that occur *before* the stream starts,
    // like JSON parsing errors or the ProcessingRuleError from the use case.
    const errorMessage = "An unexpected server error occurred.";
    const status = 500;

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
function streamFromGenerator<T>(
  generator: AsyncGenerator<T>
): ReadableStream<T> {
  return new ReadableStream<T>({
    async pull(controller) {
      const { value, done } = await generator.next();
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
      generator.return(undefined);
    },
  });
}
