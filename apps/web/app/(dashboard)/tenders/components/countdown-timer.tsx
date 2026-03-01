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
    if (!closingDate || !closingDate.trim()) {
      setTimeLeft("No date");
      return;
    }

    let dateString = closingDate.trim().replace(/\s+/g, 'T');
    let target: Date;

    if (dateString.includes('T')) {
      target = new Date(dateString);
    } else {
      let time = closingTime?.trim() || "23:59:00";
      
      // Ensure time has seconds for consistent ISO format
      // If "17:00", it becomes "17:00:00". If already "17:00:00", it stays the same.
      const timeParts = time.split(':');
      if (timeParts.length === 2) {
        time = `${time}:00`;
      }
      
      target = new Date(`${dateString}T${time}`);
    }

    if (isNaN(target.getTime())) {
      setTimeLeft("Invalid date");
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
      } catch (error) {
        console.error('CountdownTimer error:', error, closingDate, closingTime);
        setTimeLeft("—");
      }
    };

    update();
    const intervalId = setInterval(update, 60000); // update every minute
    return () => clearInterval(intervalId);
  }, [closingDate, closingTime]);

  const isUrgent = timeLeft !== "Closed" && 
                   !timeLeft.includes("d") && 
                   timeLeft !== "—" && 
                   timeLeft !== "No date" && 
                   timeLeft !== "Invalid date";

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