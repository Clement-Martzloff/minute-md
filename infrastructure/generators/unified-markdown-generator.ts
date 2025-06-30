import { MeetingReport } from "@/core/entities/meeting-report";
import {
  MarkdownGenerationEvent,
  MarkdownGenerator,
  StepChunk,
  StepEnd,
  StepStart,
} from "@/core/ports/markdown-generator";
import { Root, RootContent, Table, TableCell, TableRow } from "mdast";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

const DEFAULT_CHUNK_SIZE = 128;
const DEFAULT_DELAY_MS = 20;

export type UnifiedMarkdownCompilerOptions = {
  chunkSize?: number;
  delayMs?: number;
};

export class UnifiedMarkdownGenerator implements MarkdownGenerator {
  private readonly chunkSize: number;
  private readonly delayMs: number;
  private processor = unified().use(remarkGfm).use(remarkStringify, {
    bullet: "-",
    listItemIndent: "one",
  });

  constructor(options?: UnifiedMarkdownCompilerOptions) {
    this.chunkSize = options?.chunkSize ?? DEFAULT_CHUNK_SIZE;
    this.delayMs = options?.delayMs ?? DEFAULT_DELAY_MS;
  }

  private createCell(text: string): TableCell {
    return {
      type: "tableCell",
      children: [{ type: "text", value: text }],
    };
  }

  public async *generate(
    report: MeetingReport
  ): AsyncGenerator<MarkdownGenerationEvent> {
    yield new StepStart("markdown-generation");

    const docNodes: RootContent[] = [];

    docNodes.push({
      type: "heading",
      depth: 1,
      children: [{ type: "text", value: report.title }],
    });

    docNodes.push(
      {
        type: "heading",
        depth: 2,
        children: [{ type: "text", value: "Summary" }],
      },
      { type: "paragraph", children: [{ type: "text", value: report.summary }] }
    );

    docNodes.push(
      {
        type: "heading",
        depth: 2,
        children: [{ type: "text", value: "Participants" }],
      },
      {
        type: "list",
        ordered: false,
        children: report.participants.map((p) => ({
          type: "listItem",
          children: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  value: p.role ? `${p.name} (${p.role})` : p.name,
                },
              ],
            },
          ],
        })),
      }
    );

    if (report.agenda.length > 0) {
      docNodes.push(
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Agenda" }],
        },
        {
          type: "list",
          ordered: true,
          children: report.agenda.map((item) => ({
            type: "listItem",
            children: [
              { type: "paragraph", children: [{ type: "text", value: item }] },
            ],
          })),
        }
      );
    }

    docNodes.push(
      {
        type: "heading",
        depth: 2,
        children: [{ type: "text", value: "Discussion" }],
      },
      ...(report.discussion.flatMap((d) => [
        {
          type: "paragraph",
          children: [
            {
              type: "strong",
              children: [{ type: "text", value: `${d.speaker}:` }],
            },
            { type: "text", value: ` ${d.text}` },
          ],
        },
      ]) as RootContent[]) // Without this cast, TypeScript may infer a broader or incompatible type from the inline array.
    );

    if (report.actionItems.length > 0) {
      const headerRow: TableRow = {
        type: "tableRow",
        children: [
          this.createCell("Description"),
          this.createCell("Owner"),
          this.createCell("Due Date"),
        ],
      };

      const dataRows: TableRow[] = report.actionItems.map((item) => ({
        type: "tableRow",
        children: [
          this.createCell(item.description),
          this.createCell(item.owner || ""),
          this.createCell(item.dueDate || ""),
        ],
      }));

      const actionItemsTable: Table = {
        type: "table",
        align: ["left", "left", "left"],
        children: [headerRow, ...dataRows],
      };

      docNodes.push(
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Action Items" }],
        },
        actionItemsTable
      );
    } else {
      docNodes.push(
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Action Items" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "No action items were assigned." }],
        }
      );
    }

    const documentTree: Root = { type: "root", children: docNodes };
    const markdownString = this.processor.stringify(documentTree);

    for (let i = 0; i < markdownString.length; i += this.chunkSize) {
      const chunk = markdownString.substring(i, i + this.chunkSize);

      yield new StepChunk("markdown-generation", chunk);

      if (this.delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.delayMs));
      }
    }

    yield new StepEnd("markdown-generation", { markdownString });
  }
}
