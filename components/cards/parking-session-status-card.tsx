"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardTitle, StatPill } from "@/components/ui/card";
import type { ParkingLot, ParkingSession } from "@/lib/types";

function formatDuration(ms: number) {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ParkingSessionStatusCard({ session, lot }: { session: ParkingSession; lot: ParkingLot }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const startedAtMs = new Date(session.startedAt).getTime();
  const safeUntilMs = new Date(session.expectedEndAt).getTime();
  const elapsed = now - startedAtMs;
  const remaining = safeUntilMs - now;

  const warning = useMemo(() => {
    if (remaining <= 0) return "You are beyond the allowed window and should move immediately.";
    if (remaining <= 10 * 60 * 1000) return "Urgent push warning would fire now because fewer than 10 minutes remain.";
    if (remaining <= 30 * 60 * 1000) return "Push warning is armed because you are within 30 minutes of the limit.";
    return "Push warning monitoring is active for the current session.";
  }, [remaining]);

  return (
    <Card style={{ background: "linear-gradient(180deg,#ffffff 0%, #f6fbf8 100%)" }}>
      <div className="flex items-start justify-between gap-4">
        <CardTitle title="Current parking timer" subtitle={`Session started when the car occupied ${lot.lotCode} and will stop when the slot is released.`} />
        <StatPill label="Safe until" value={session.expectedEndAt.split("T")[1].slice(0, 5)} tone={remaining <= 30 * 60 * 1000 ? "red" : "green"} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-[#dbe9e1] bg-white p-4">
          <p className="text-sm text-slate-500">Time parked</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-[#003E51]">{formatDuration(elapsed)}</p>
          <p className="mt-2 text-sm text-slate-600">The timer begins once the system marks the slot as occupied.</p>
        </div>
        <div className="rounded-[24px] border border-[#dbe9e1] bg-white p-4">
          <p className="text-sm text-slate-500">Time until warning limit</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-[#007a4d]">{formatDuration(remaining)}</p>
          <p className="mt-2 text-sm text-slate-600">You must leave the parking space by the allowed time shown in the rules engine.</p>
        </div>
      </div>
      <div className="mt-4 rounded-[24px] border border-[#dbe9e1] bg-[#f8fbf9] p-4">
        <p className="text-sm font-semibold text-[#003E51]">Push notification status</p>
        <p className="mt-2 text-sm leading-7 text-slate-600">{warning}</p>
      </div>
    </Card>
  );
}
