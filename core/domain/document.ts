export class InvalidDocumentNameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDocumentNameError";
  }
}

export class Document {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _content: string;
  private readonly _metadata?: Record<string, unknown>;

  constructor(params: {
    id: string;
    name: string;
    content: string;
    metadata?: Record<string, unknown>;
  }) {
    if (!params.name || params.name.trim() === "") {
      throw new InvalidDocumentNameError("Document name cannot be empty.");
    }

    this._id = params.id;
    this._name = params.name;
    this._content = params.content;
    this._metadata = params.metadata;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get content(): string {
    return this._content;
  }

  public get metadata(): Record<string, unknown> | undefined {
    return this._metadata;
  }
}
