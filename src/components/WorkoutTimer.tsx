"use client";

import { useState, useEffect } from "react";

interface Props {
  startTime: string;
}

export default function WorkoutTimer({ startTime }: Props) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    function update() {
      const start = new Date(startTime).getTime();
      const diff = Date.now() - start;
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      const hours = Math.floor(mins / 60);
      const remainMins = mins % 60;

      if (hours > 0) {
        setElapsed(`${hours}:${remainMins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
      } else {
        setElapsed(`${remainMins}:${secs.toString().padStart(2, "0")}`);
      }
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <span className="font-mono text-sm font-semibold" style={{ color: "var(--accent)" }}>
      {elapsed}
    </span>
  );
}
