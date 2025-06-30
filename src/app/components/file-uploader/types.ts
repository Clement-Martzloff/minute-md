export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}
