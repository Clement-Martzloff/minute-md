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
    <div className="bg-yellow-300 border-2 border-black rounded-none px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
      <span className="font-black text-black text-sm font-mono tracking-wider">
        {formatTime(elapsedTime)}
      </span>
    </div>
  );
}
