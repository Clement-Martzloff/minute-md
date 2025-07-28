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
    <div className="bg-secondary rounded-md px-2">
      <span className="font-mono text-sm font-semibold tracking-tight">
        {formatTime(elapsedTime)}
      </span>
    </div>
  );
}
