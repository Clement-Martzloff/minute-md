import FileCard from "@/src/app/components/file-uploader/FileCard";
import type { FileItem } from "@/src/app/components/file-uploader/types";

interface FileListProps {
  files: FileItem[];
  onRemoveFile: (id: string) => void;
}

export default function FileList({ files, onRemoveFile }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold tracking-tight text-gray-900">
        Selected Files ({files.length})
      </h3>

      <div className="grid gap-4">
        {files.map((file) => (
          <FileCard key={file.id} file={file} onRemove={onRemoveFile} />
        ))}
      </div>
    </div>
  );
}
