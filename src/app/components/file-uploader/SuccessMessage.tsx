interface SuccessMessageProps {
  message?: string;
}

export default function SuccessMessage({
  message = "🚀 READY TO GENERATE YOUR AI REPORT!",
}: SuccessMessageProps) {
  return (
    <div className="mt-6 p-4 bg-cyan-200 border-4 border-cyan-600 rounded-none shadow-[4px_4px_0px_0px_#0891b2]">
      <p className="text-cyan-900 font-black text-center">{message}</p>
    </div>
  );
}
