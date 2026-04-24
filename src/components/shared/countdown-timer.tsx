"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endDate: string | Date;
  className?: string;
  onExpire?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(endDate: Date): TimeLeft | null {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ endDate, className, onExpire }: CountdownTimerProps) {
  const target = new Date(endDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calcTimeLeft(target));

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calcTimeLeft(target);
      setTimeLeft(tl);
      if (!tl) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return <span className={cn("text-sm text-destructive font-medium", className)}>Expired</span>;
  }

  const blocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold tabular-nums leading-none">
              {String(block.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">{block.label}</span>
          </div>
          {i < blocks.length - 1 && (
            <span className="text-lg font-bold text-muted-foreground">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
