import { useState, useEffect } from "react";

interface RateLimitTimerProps {
  resetTime: string;
}

export default function RateLimitTimer({ resetTime }: RateLimitTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!resetTime) return;

    // resetTime from GitHub is in seconds since epoch
    const resetDate = new Date(Number(resetTime) * 1000);

    const calculateTimeLeft = () => {
      const difference = resetDate.getTime() - new Date().getTime();
      return Math.max(0, Math.floor(difference / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [resetTime]);

  if (timeLeft === null) return null;

  if (timeLeft === 0) {
    return (
      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium animate-pulse">
        Rate limit reset! You can try again now.
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex flex-col items-center justify-center">
      <span className="text-orange-600 dark:text-orange-400 text-sm mb-1 font-semibold">
        Rate limit resets in
      </span>
      <div className="text-3xl font-mono font-bold text-orange-500 tabular-nums tracking-widest">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
}
