import { File, FileText } from "lucide-react";

interface FileIconProps {
  type: string;
  className?: string;
}

export default function FileIcon({
  type,
  className = "w-6 h-6",
}: FileIconProps) {
  if (type.includes("pdf")) return <FileText className={className} />;
  if (type.includes("word") || type.includes("document"))
    return <File className={className} />;
  if (type.includes("text")) return <FileText className={className} />;
  return <File className={className} />;
}
