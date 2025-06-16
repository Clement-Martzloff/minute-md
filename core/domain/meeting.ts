export interface MeetingReport {
  title: string;
  summary: string;
  participants: {
    name: string;
    role?: string;
  }[];
  agenda: string[];
  discussion: {
    speaker: string;
    text: string;
  }[];
  actionItems: {
    description: string;
    owner?: string;
    dueDate?: string;
  }[];
}
