import { Document } from "@/core/ports/document-repository";
import { listDocuments } from "@/infrastructure/nextjs/drive-server";

export default async function DrivePage() {
  const documents: Document[] = await listDocuments();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Google Drive Documents</h1>
      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <ul className="list-disc pl-5">
          {documents.map((doc) => (
            <li key={doc.id}>{doc.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
