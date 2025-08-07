import { GenerationEvent } from "@/core/events/generation-events";
import { setupDI } from "@/ioc/setupDi";
import { FileItem } from "@/src/app/components/files-dropzone/types";

const container = setupDI();
const loadSelectedFilesUseCase = container.resolve("LoadSelectedFiles");
const GenerateReportUseCase = container.resolve("GenerateReportUseCase");

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
      await loadSelectedFilesUseCase.execute(files);

    const eventStream = GenerateReportUseCase.execute(
      loadedAndValidatedDocuments,
    );

    const transformStream = new TransformStream<GenerationEvent, Uint8Array>({
      transform(event, controller) {
        const encoder = new TextEncoder();
        const dataString = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(dataString));
      },
    });

    const readableStream =
      streamFromGenerator(eventStream).pipeThrough(transformStream);

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    const errorMessage = "An unexpected server error occurred.";
    const status = 500;

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: status,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function streamFromGenerator<T>(
  generator: AsyncGenerator<T>,
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
    cancel() {
      generator.return(undefined);
    },
  });
}
