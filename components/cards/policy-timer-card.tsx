import { Card } from "@/components/ui/card";
import type { CountdownPolicy } from "@/lib/engines/parking-policy-guide";

const stateStyles = {
  safe: "bg-[#e8f5ee] text-[#0f6c3a]",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-rose-100 text-rose-700",
  expired: "bg-[#111827] text-white"
} as const;

function formatRemaining(remainingMs: number) {
  const totalSeconds = Math.max(Math.floor(remainingMs / 1000), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export function PolicyTimerCard({ timer }: { timer: CountdownPolicy }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#0f172a]">{timer.title}</p>
          <p className="mt-1 text-sm text-slate-500">{timer.appliesTo}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stateStyles[timer.visualState]}`}>{timer.visualState}</span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-[#003E51]">{formatRemaining(timer.remainingMs)}</p>
      <p className="mt-2 text-sm text-slate-600">Target time: {timer.targetTime}</p>
    </Card>
  );
}
