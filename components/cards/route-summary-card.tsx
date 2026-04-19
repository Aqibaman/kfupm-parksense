import { Card } from "@/components/ui/card";
import type { LiveMapBusRoute } from "@/lib/types";

export function RouteSummaryCard({
  route,
  activeBusCount,
  serviceStatus,
  nextStopSummaries
}: {
  route: LiveMapBusRoute;
  activeBusCount: number;
  serviceStatus: { active: boolean; label: string };
  nextStopSummaries: string[];
}) {
  return (
    <Card className="min-w-0 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#008540]">{route.code}</p>
          <h3 className="mt-2 text-xl font-semibold text-[#0f172a] sm:text-2xl">{route.name}</h3>
          <p className="mt-2 text-sm text-slate-500">{route.timingLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#eef8f2] px-3 py-1 text-xs font-semibold text-[#008540]">Active buses: {activeBusCount}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${serviceStatus.active ? "bg-[#e8f5ee] text-[#0f6c3a]" : "bg-[#fff4e7] text-[#8a6a14]"}`}>
            {serviceStatus.active ? "In service" : "Inactive"}
          </span>
        </div>
      </div>
      <p className="mt-4 break-words text-sm leading-7 text-slate-600">{route.serviceNote}</p>
      <div className="mt-4 rounded-[22px] border border-[#dbe9e1] bg-[#f9fcfa] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0b5b72]">Service status</p>
        <p className="mt-2 text-sm font-medium text-[#0f172a]">{serviceStatus.label}</p>
      </div>
      <div className="mt-4 space-y-2">
        {nextStopSummaries.slice(0, 3).map((summary) => (
          <div key={summary} className="break-words rounded-2xl border border-[#dbe9e1] bg-white px-3 py-3 text-sm text-slate-600 sm:px-4">
            {summary}
          </div>
        ))}
      </div>
    </Card>
  );
}
