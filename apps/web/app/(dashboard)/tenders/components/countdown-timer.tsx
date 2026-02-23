"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  closingDate: string;
  closingTime?: string;  
};

export default function CountdownTimer({ closingDate, closingTime }: Props) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      try {
        // Default to 23:59 if closingTime is missing but date exists
        const time = closingTime?.trim() ? closingTime.trim() : "23:59";
        const target = new Date(`${closingDate}T${time}:00`);

        // Invalid date → show dash
        if (isNaN(target.getTime())) {
          setTimeLeft("—");
          return;
        }

        const diff = target.getTime() - Date.now();

        if (diff <= 0) {
          setTimeLeft("Closed");
          return;
        }

        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m`);
        }
      } catch {
        setTimeLeft("—");
      }
    };

    update();
    const intervalId = setInterval(update, 60000); // update every minute
    return () => clearInterval(intervalId);
  }, [closingDate, closingTime]);

  const isUrgent = timeLeft !== "Closed" && !timeLeft.includes("d") && timeLeft !== "—";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-sm",
        isUrgent ? "text-red-600 font-medium" : "text-muted-foreground"
      )}
    >
      <Clock className="h-3.5 w-3.5" />
      {timeLeft}
    </div>
  );
}