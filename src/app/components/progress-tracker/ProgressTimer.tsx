interface ProgressTimerProps {
  elapsedTime: number;
}

export default function ProgressTimer({ elapsedTime }: ProgressTimerProps) {
  const formatTime = (ms: number): string => {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${minutes}:${seconds}.${centiseconds}`;
  };

  return (
    <div className="rounded-none border-2 border-black bg-yellow-300 px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
      <span className="font-mono text-sm font-bold tracking-wider text-black">
        {formatTime(elapsedTime)}
      </span>
    </div>
  );
}
