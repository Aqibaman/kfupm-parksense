import { CarFront, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ParkingPageData } from "@/lib/engines/parking-session";

function formatElapsed(startedAt: string, now: Date) {
  const elapsed = Math.max(now.getTime() - new Date(startedAt).getTime(), 0);
  const totalSeconds = Math.floor(elapsed / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export function ActiveParkingSessionCard({ data, now }: { data: ParkingPageData; now: Date }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CarFront className="h-5 w-5 text-[#008540]" />
            <h3 className="text-lg font-semibold text-slate-950">Active parking session</h3>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Slot {data.session.slotId} · {data.session.floorKey ?? "Ground"} · started at{" "}
            {new Date(data.session.parkedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
            data.ruleResult.violationRiskStatus === "critical"
              ? "bg-rose-100 text-rose-700"
              : data.ruleResult.violationRiskStatus === "warning"
                ? "bg-amber-100 text-amber-700"
                : "bg-[#edf7f2] text-[#007a4d]"
          }`}
        >
          {data.ruleResult.violationRiskStatus === "none" ? "Compliant" : data.ruleResult.violationRiskStatus}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4">
          <p className="text-sm text-slate-500">Time parked</p>
          <p className="mt-2 text-3xl font-semibold text-[#003E51]">{formatElapsed(data.session.parkedAt, now)}</p>
        </div>
        <div className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4">
          <p className="text-sm text-slate-500">Leave by</p>
          <p className="mt-2 text-3xl font-semibold text-[#008540]">{data.ruleResult.leaveByTime ?? "No time limit"}</p>
        </div>
        <div className="rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#0b5b72]" />
            <p className="text-sm text-slate-500">Permit status</p>
          </div>
          <p className="mt-2 text-lg font-semibold text-[#003E51]">
            {data.ruleResult.permitStatus === "allowed"
              ? "Allowed"
              : data.ruleResult.permitStatus === "restricted"
                ? "Restricted access"
                : "Unauthorized"}
          </p>
        </div>
      </div>
    </Card>
  );
}
