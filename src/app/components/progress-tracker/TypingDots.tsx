export default function TypingDots() {
  return (
    <div className="flex space-x-1 ml-2">
      <div
        className="w-2 h-2 bg-black rounded-none animate-pulse shadow-[1px_1px_0px_0px_#000]"
        style={{ animationDelay: "0ms", animationDuration: "1s" }}
      />
      <div
        className="w-2 h-2 bg-black rounded-none animate-pulse shadow-[1px_1px_0px_0px_#000]"
        style={{ animationDelay: "200ms", animationDuration: "1s" }}
      />
      <div
        className="w-2 h-2 bg-black rounded-none animate-pulse shadow-[1px_1px_0px_0px_#000]"
        style={{ animationDelay: "400ms", animationDuration: "1s" }}
      />
    </div>
  );
}
