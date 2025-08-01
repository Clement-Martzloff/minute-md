export class InvalidMeetingReportTitleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMeetingReportTitleError";
  }
}

export class InvalidMeetingReportSummaryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMeetingReportSummaryError";
  }
}

export class InvalidMeetingReportParticipantsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMeetingReportParticipantsError";
  }
}

export type Participant = {
  name: string;
  role?: string;
};

export type DiscussionPoint = {
  speaker: string;
  text: string;
};

export type ActionItem = {
  description: string;
  owner?: string;
  dueDate?: string;
};

export type MeetingReportDto = {
  title: string;
  summary: string;
  participants: Participant[];
  agenda: string[];
  discussion: DiscussionPoint[];
  actionItems: ActionItem[];
};

export class MeetingReport {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _summary: string;
  private readonly _participants: Participant[];
  private readonly _agenda: string[];
  private readonly _discussion: DiscussionPoint[];
  private readonly _actionItems: ActionItem[];

  constructor(params: MeetingReportDto & { id: string }) {
    if (!params.id || params.id.trim() === "") {
      throw new Error("Meeting Report ID cannot be empty.");
    }

    if (!params.title || params.title.trim() === "") {
      throw new InvalidMeetingReportTitleError(
        "Meeting report title cannot be empty."
      );
    }

    if (!params.summary || params.summary.trim() === "") {
      throw new InvalidMeetingReportSummaryError(
        "Meeting report summary cannot be empty."
      );
    }

    if (!params.participants || params.participants.length === 0) {
      throw new InvalidMeetingReportParticipantsError(
        "A meeting must have at least one participant."
      );
    }
    params.participants.forEach((p, index) => {
      if (!p.name || p.name.trim() === "") {
        throw new InvalidMeetingReportParticipantsError(
          `Participant at index ${index} must have a name.`
        );
      }
    });

    params.discussion.forEach((d, index) => {
      if (!d.speaker?.trim() || !d.text?.trim()) {
        throw new Error(
          `Discussion point at index ${index} must have a non-empty speaker and text.`
        );
      }
    });

    params.actionItems.forEach((a, index) => {
      if (!a.description?.trim()) {
        throw new Error(
          `Action item at index ${index} must have a non-empty description.`
        );
      }
    });

    this._id = params.id;
    this._title = params.title;
    this._summary = params.summary;
    this._participants = params.participants.map((p) => ({ ...p }));
    this._agenda = [...params.agenda];
    this._discussion = params.discussion.map((d) => ({ ...d }));
    this._actionItems = params.actionItems.map((a) => ({ ...a }));
  }

  public get id(): string {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }

  public get summary(): string {
    return this._summary;
  }

  public get participants(): Participant[] {
    return this._participants.map((p) => ({ ...p }));
  }

  public get agenda(): string[] {
    return [...this._agenda];
  }

  public get discussion(): DiscussionPoint[] {
    return this._discussion.map((d) => ({ ...d }));
  }

  public get actionItems(): ActionItem[] {
    return this._actionItems.map((a) => ({ ...a }));
  }
}
