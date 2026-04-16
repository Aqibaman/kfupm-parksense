"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, StatPill } from "@/components/ui/card";

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ViolationCountdownCard({
  title,
  deadline,
  tone = "warning",
  helper
}: {
  title: string;
  deadline: string;
  tone?: "warning" | "critical" | "safe";
  helper: string;
}) {
  const [remaining, setRemaining] = useState(() => new Date(deadline).getTime() - Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(new Date(deadline).getTime() - Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [deadline]);

  const pillTone = tone === "critical" ? "red" : tone === "safe" ? "green" : "yellow";

  return (
    <Card className="text-[#003E51]" style={{ background: "linear-gradient(180deg,#ffffff 0%, #f6fbf8 100%)" }}>
      <div className="flex items-start justify-between gap-4">
        <CardTitle title={title} subtitle={helper} />
        <StatPill label="Countdown" value={formatRemaining(remaining)} tone={pillTone} />
      </div>
      <div className="mt-4 text-4xl font-semibold tracking-tight" style={{ color: "var(--category-primary)" }}>{formatRemaining(remaining)}</div>
      <p className="mt-3 text-sm text-[#557072]">Alarm-ready UI state for browser or mobile app push workflows.</p>
    </Card>
  );
}
