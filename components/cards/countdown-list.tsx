import { Clock3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { CountdownTimer } from "@/lib/engines/parking-session";

function formatDurationMs(ms: number) {
  const safe = Math.max(ms, 0);
  const totalSeconds = Math.floor(safe / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export function CountdownList({ countdowns }: { countdowns: CountdownTimer[] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <Clock3 className="h-5 w-5 text-[#008540]" />
        <h3 className="text-lg font-semibold text-slate-950">Live countdowns</h3>
      </div>
      <div className="space-y-3">
        {countdowns.length ? (
          countdowns.map((countdown) => (
            <div key={countdown.id} className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#003E51]">{countdown.label}</p>
                  <p className="mt-1 text-xs text-slate-500">Leave-by target: {countdown.targetTime}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    countdown.status === "expired"
                      ? "bg-rose-100 text-rose-700"
                      : countdown.status === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-[#edf7f2] text-[#007a4d]"
                  }`}
                >
                  {formatDurationMs(countdown.remainingMs)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#dbe9e1] bg-[#fbfdfc] px-4 py-6 text-sm text-slate-500">
            No active timer-based alerts are running for this session.
          </div>
        )}
      </div>
    </Card>
  );
}
