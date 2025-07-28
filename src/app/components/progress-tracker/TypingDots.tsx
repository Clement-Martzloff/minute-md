export default function TypingDots() {
  return (
    <div className="mr-2 flex space-x-1">
      <div
        className="bg-secondary-foreground h-2 w-2 animate-pulse rounded-full"
        style={{ animationDelay: "0ms", animationDuration: "1s" }}
      />
      <div
        className="bg-secondary-foreground h-2 w-2 animate-pulse rounded-full"
        style={{ animationDelay: "200ms", animationDuration: "1s" }}
      />
      <div
        className="bg-secondary-foreground h-2 w-2 animate-pulse rounded-full"
        style={{ animationDelay: "400ms", animationDuration: "1s" }}
      />
    </div>
  );
}
