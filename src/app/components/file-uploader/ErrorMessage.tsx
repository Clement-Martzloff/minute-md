interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mb-6 p-4 bg-red-200 border-4 border-red-500 rounded-none shadow-[4px_4px_0px_0px_#dc2626]">
      <p className="text-red-800 font-bold">{message}</p>
    </div>
  );
}
