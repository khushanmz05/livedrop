import React, { useEffect, useState } from "react";

interface DropCountdownProps {
  dropTime?: Date; // optional now
  onDropStart?: () => void;
  onDropEnd?: () => void;
  durationSeconds?: number;
}

export default function DropCountdown({
  dropTime,
  onDropStart,
  onDropEnd,
  durationSeconds = 300,
}: DropCountdownProps) {
  // Always call hooks, no early return
  const [now, setNow] = useState(new Date());
  const [status, setStatus] = useState<"upcoming" | "live" | "ended">("upcoming");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!dropTime || isNaN(dropTime.getTime())) return;

    const dropStart = dropTime.getTime();
    const dropEnd = dropStart + durationSeconds * 1000;
    const current = now.getTime();

    if (current < dropStart) {
      setStatus("upcoming");
    } else if (current >= dropStart && current < dropEnd) {
      if (status !== "live") {
        setStatus("live");
        onDropStart?.();
      }
    } else {
      if (status !== "ended") {
        setStatus("ended");
        onDropEnd?.();
      }
    }
  }, [now, dropTime, durationSeconds, status, onDropStart, onDropEnd]);

  // If dropTime is invalid, render nothing
  if (!dropTime || isNaN(dropTime.getTime())) {
    return null;
  }

  const getTimeLeft = () => {
    const targetTime =
      status === "upcoming"
        ? dropTime.getTime()
        : dropTime.getTime() + durationSeconds * 1000;
    const diff = Math.max(0, targetTime - now.getTime());
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = getTimeLeft();

  return (
    <div>
      {status === "upcoming" && (
        <p>
          <span className="font-bold text-red-300">
            Drop starts in: {hours}h {minutes}m {seconds}s
          </span>
        </p>
      )}
      {status === "live" && (
        <p>
          Drop live! Ends in: {hours}h {minutes}m {seconds}s
        </p>
      )}
      {status === "ended" && <p>Drop ended.</p>}
    </div>
  );
}
