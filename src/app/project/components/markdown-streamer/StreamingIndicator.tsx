export default function StreamingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-lime-400 rounded-none animate-pulse border border-black shadow-[1px_1px_0px_0px_#000]"
          style={{ animationDelay: "0ms", animationDuration: "0.8s" }}
        />
        <div
          className="w-2 h-2 bg-lime-400 rounded-none animate-pulse border border-black shadow-[1px_1px_0px_0px_#000]"
          style={{ animationDelay: "200ms", animationDuration: "0.8s" }}
        />
        <div
          className="w-2 h-2 bg-lime-400 rounded-none animate-pulse border border-black shadow-[1px_1px_0px_0px_#000]"
          style={{ animationDelay: "400ms", animationDuration: "0.8s" }}
        />
      </div>
      <span className="font-black text-black text-sm tracking-tight">
        STREAMING...
      </span>
    </div>
  );
}
