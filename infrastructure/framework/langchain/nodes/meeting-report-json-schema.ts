import z from "zod";

export const meetingReportJsonSchema = z
  .object({
    title: z
      .string()
      .describe("The main title or subject of the meeting. Should be concise."),
    summary: z
      .string()
      .describe(
        "A 2-3 sentence executive summary of the meeting's purpose, key outcomes, and major decisions."
      ),
    participants: z
      .array(
        z.object({
          name: z.string().describe("The name of the participant."),
          role: z
            .string()
            .optional()
            .describe("The participant's role or team, if mentioned."),
        })
      )
      .describe("A list of all unique participants who attended the meeting."),
    agenda: z
      .array(z.string())
      .describe(
        "The list of topics or items that were planned for discussion."
      ),
    discussion: z
      .array(
        z.object({
          speaker: z
            .string()
            .describe(
              "The name of the person speaking. Use 'Unidentified Speaker' if not known."
            ),
          text: z
            .string()
            .describe(
              "A summary of the key point, comment, or question raised by the speaker."
            ),
        })
      )
      .describe("A structured summary of the key points discussed."),
    actionItems: z
      .array(
        z.object({
          description: z
            .string()
            .describe("A clear, actionable task or commitment."),
          owner: z
            .string()
            .optional()
            .describe("The person assigned to the action item."),
          dueDate: z
            .string()
            .optional()
            .describe(
              "The deadline for the action item (e.g., 'EOD Friday', '2023-12-25')."
            ),
        })
      )
      .describe(
        "A list of all clear decisions, action items, or agreed-upon next steps."
      ),
  })
  .describe(
    "The final, structured report summarizing the meeting's key information."
  );

export type MeetingReportJsonSchemaType = z.infer<
  typeof meetingReportJsonSchema
>;
