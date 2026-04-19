"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
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
const storageKey = `kfupm-parkwise-session-${session.id}`;
  const [parkedAt, setParkedAt] = useState<number | null>(null);
  const [leftAt, setLeftAt] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as { parkedAt: number | null; leftAt: number | null };
      setParkedAt(parsed.parkedAt);
      setLeftAt(parsed.leftAt);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ parkedAt, leftAt }));
  }, [leftAt, parkedAt, storageKey]);

  const safeUntilMs = new Date(session.expectedEndAt).getTime();
  const leaveByTime = session.expectedEndAt.split("T")[1].slice(0, 5);
  const activeEndPoint = leftAt ?? now;
  const elapsed = parkedAt ? activeEndPoint - parkedAt : 0;
  const remaining = parkedAt && !leftAt ? safeUntilMs - now : safeUntilMs - (leftAt ?? now);
  const isActive = Boolean(parkedAt && !leftAt);

  function handleParked() {
    const startedNow = Date.now();
    setParkedAt(startedNow);
    setLeftAt(null);
  }

  function handleLeaving() {
    if (!parkedAt) return;
    setLeftAt(Date.now());
  }

  return (
    <Card style={{ background: "linear-gradient(180deg,#ffffff 0%, #f6fbf8 100%)" }}>
      <CardTitle title="Current parking timer" subtitle={`Use the buttons below to mark when you parked in ${lot.lotCode}. The leave-by time follows this lot's active parking restriction.`} />
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleParked}
          className="inline-flex rounded-full bg-[#007a4d] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,133,64,0.18)]"
        >
          I parked
        </button>
        <button
          type="button"
          onClick={handleLeaving}
          className="inline-flex rounded-full bg-[#0d5f74] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,62,81,0.16)]"
        >
          I am leaving
        </button>
        <span className="inline-flex rounded-full bg-[#eff8f3] px-4 py-2.5 text-sm font-medium text-[#007a4d]">
          {isActive ? "Timer running" : parkedAt ? "Timer stopped" : "Waiting for parking action"}
        </span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-[#dbe9e1] bg-white p-4">
          <p className="text-sm text-slate-500">Time parked</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-[#003E51]">{formatDuration(elapsed)}</p>
          <p className="mt-2 text-sm text-slate-600">The timer starts when you click parked and stops when you click leaving.</p>
        </div>
        <div className="rounded-[24px] border border-[#dbe9e1] bg-white p-4">
          <p className="text-sm text-slate-500">Leave by</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-[#007a4d]">{leaveByTime}</p>
          <p className="mt-2 text-sm text-slate-600">You have to leave this parking lot by {leaveByTime} based on the current time restriction for this lot.</p>
        </div>
      </div>
    </Card>
  );
}
