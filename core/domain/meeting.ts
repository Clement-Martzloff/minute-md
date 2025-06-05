export interface MeetingReport {
  title?: string;
  participants: string[];
  agenda: string[];
  discussion: { speaker: string; text: string }[];
  decisions: string[];
}
