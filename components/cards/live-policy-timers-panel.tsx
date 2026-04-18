"use client";

import { useEffect, useMemo, useState } from "react";
import { PolicyTimerCard } from "@/components/cards/policy-timer-card";
import { Card, CardTitle } from "@/components/ui/card";
import { getCountdownPolicies, type CheckerInput } from "@/lib/engines/parking-policy-guide";

export function LivePolicyTimersPanel({ input }: { input: CheckerInput }) {
  const [now, setNow] = useState(input.currentTime);

  useEffect(() => {
    setNow(input.currentTime);
  }, [input.currentTime]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const date = new Date();
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      setNow(`${hh}:${mm}`);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const timers = useMemo(() => getCountdownPolicies({ ...input, currentTime: now }, now), [input, now]);

  return (
    <Card>
      <CardTitle title="Live Policy Timers" subtitle="Live countdowns for commuter cutoffs, Student Mall duration, and current warning states." />
      {timers.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {timers.map((timer) => (
            <PolicyTimerCard key={timer.id} timer={timer} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#dbe9e1] p-4 text-sm text-slate-600">
          No active timers right now. Use the checker with a commuter lot or Student Mall to preview live policy countdowns.
        </div>
      )}
    </Card>
  );
}
