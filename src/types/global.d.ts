/** @see https://developers.google.com/workspace/drive/picker/reference/picker.pickerbuilder?hl=fr */
declare namespace google.picker {
  /** @see https://developers.google.com/workspace/drive/picker/reference/picker.viewid.md?hl=fr */
  enum ViewId {
    DOCUMENTS = "documents",
  }

  enum Feature {
    MULTISELECT_ENABLED = "multiselectEnabled",
  }

  enum Action {
    PICKED = "picked",
    CANCEL = "cancel",
  }

  enum DocsViewMode {
    LIST = "list",
  }

  /** @see https://developers.google.com/workspace/drive/picker/reference/picker.responseobject.docs.md?hl=fr */
  interface ResponseObject {
    action: Action;
    /** @see https://developers.google.com/workspace/drive/picker/reference/picker.documentobject.md?hl=fr */
    docs?: Array<{
      id: string;
      name: string;
      mimeType: string;
      iconUrl?: string;
      url?: string;
    }>;
  }

  class View {
    constructor(viewId: ViewId);
  }

  class PickerBuilder {
    addView(view: View): PickerBuilder;
    build(): Picker;
    enableFeature(feature: Feature): PickerBuilder;
    setAppId(appId: string): PickerBuilder;
    setOAuthToken(token: string): PickerBuilder;
    setCallback(cb: (data: ResponseObject) => void): PickerBuilder;
    setDeveloperKey(key: string): PickerBuilder;
  }

  class DocsView {
    constructor(viewId?: ViewId);
    setIncludeFolders(included: boolean): DocsView;
    setSelectFolderEnabled(enabled: boolean): DocsView;
    setMode(mode: DocsViewMode): DocsView;
  }

  interface Picker {
    setVisible(visible: boolean): void;
  }
}
