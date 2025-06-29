import FileCard from "@/src/app/project/components/file-uploader/FileCard";
import SuccessMessage from "@/src/app/project/components/file-uploader/SuccessMessage";
import type { FileItem } from "@/src/app/project/components/file-uploader/types";

interface FileListProps {
  files: FileItem[];
  onRemoveFile: (id: string) => void;
}

export default function FileList({ files, onRemoveFile }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
        UPLOADED FILES ({files.length})
      </h3>

      <div className="grid gap-4">
        {files.map((file) => (
          <FileCard key={file.id} file={file} onRemove={onRemoveFile} />
        ))}
      </div>

      <SuccessMessage />
    </div>
  );
}
