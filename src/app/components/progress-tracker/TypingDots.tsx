export default function TypingDots() {
  return (
    <div className="mr-2 flex space-x-1">
      <div
        className="h-2 w-2 animate-pulse rounded-none bg-black shadow-[1px_1px_0px_0px_#000]"
        style={{ animationDelay: "0ms", animationDuration: "1s" }}
      />
      <div
        className="h-2 w-2 animate-pulse rounded-none bg-black shadow-[1px_1px_0px_0px_#000]"
        style={{ animationDelay: "200ms", animationDuration: "1s" }}
      />
      <div
        className="h-2 w-2 animate-pulse rounded-none bg-black shadow-[1px_1px_0px_0px_#000]"
        style={{ animationDelay: "400ms", animationDuration: "1s" }}
      />
    </div>
  );
}
