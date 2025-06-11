/** @see https://developers.google.com/workspace/drive/picker/reference/picker.pickerbuilder */
declare namespace google.picker {
  /** View types supported by the Picker. */
  enum ViewId {
    DOCUMENTS = "documents",
  }

  /** Features that can be enabled on the Picker. */
  enum Feature {
    MULTISELECT_ENABLED = "multiselectEnabled",
  }

  /** User actions returned in the Picker callback. */
  enum Action {
    PICKED = "picked",
    CANCEL = "cancel",
  }

  /** Display mode for DocsView. */
  enum DocsViewMode {
    LIST = "list",
  }

  /**
   * Document metadata returned by the Picker.
   * @see https://developers.google.com/workspace/drive/picker/reference/picker.documentobject
   */
  interface DocumentObject {
    /** Unique file ID. */
    readonly id: string;
    /** Display name of the file. */
    readonly name: string;
    /** MIME type of the file. */
    readonly mimeType: string;
    /** Icon representing the file type. */
    readonly iconUrl?: string;
    /** Link to open/view the file. */
    readonly url?: string;
  }

  /**
   * Response returned when the user selects files.
   * @see https://developers.google.com/workspace/drive/picker/reference/picker.responseobject.docs
   */
  interface PickedResponse {
    readonly action: Action.PICKED;
    readonly docs: DocumentObject[];
  }

  /**
   * Response returned when the user cancels the Picker.
   */
  interface CancelledResponse {
    readonly action: Action.CANCEL;
  }

  /** Union type for all Picker responses. */
  type ResponseObject = PickedResponse | CancelledResponse;

  /** Class representing a Picker view. */
  class View {
    constructor(viewId: ViewId);
  }

  /** Class for configuring and building a Google Picker. */
  class PickerBuilder {
    addView(view: View): this;
    build(): Picker;
    enableFeature(feature: Feature): this;
    setAppId(appId: string): this;
    setOAuthToken(token: string): this;
    setCallback(cb: (data: ResponseObject) => void): this;
    setDeveloperKey(key: string): this;
  }

  /** Class representing a Docs view configuration. */
  class DocsView {
    constructor(viewId?: ViewId);
    setIncludeFolders(included: boolean): this;
    setSelectFolderEnabled(enabled: boolean): this;
    setMode(mode: DocsViewMode): this;
  }

  /** The Picker instance shown to the user. */
  interface Picker {
    setVisible(visible: boolean): void;
  }
}
