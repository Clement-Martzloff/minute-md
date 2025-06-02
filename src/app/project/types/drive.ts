// Define the shape of the file metadata if we want to store in the UI/Adapter layers
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  selected: boolean;
}
