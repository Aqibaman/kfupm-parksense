import Link from "next/link";
import { Card, CardTitle, StatPill } from "@/components/ui/card";
import { formatPercent, lotAvailabilityTone } from "@/lib/utils";
import type { PermittedParkingLot } from "@/lib/engines/rules";

export function LotOccupancyCard({ lot }: { lot: PermittedParkingLot }) {
  const availabilityTone = lotAvailabilityTone(lot.occupancyRate);
  const tone = !lot.isAllowed ? "slate" : availabilityTone === "green" ? "green" : availabilityTone === "yellow" ? "yellow" : "red";
  const freeSlots = Math.round(lot.totalSlots * (1 - lot.occupancyRate));
  const statusText = lot.isAllowed ? lot.permitStatusLabel : "Not available for your permit";
  const primaryRule = lot.ruleText[0] ?? lot.specialNote;

  return (
    <Card className={!lot.isAllowed ? "opacity-70" : undefined}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{lot.zone}</p>
          <CardTitle title={`${lot.lotCode} - ${lot.lotName}`} subtitle={lot.buildingCluster} />
        </div>
        <StatPill label="Permit" value={statusText} tone={!lot.isAllowed ? "slate" : lot.permitStatusLabel === "Restricted access" ? "yellow" : "green"} />
      </div>
      <div className="mt-4 space-y-3">
        {primaryRule ? (
          <div className="rounded-2xl border border-[#dbe9e1] bg-[#f8fbf9] p-3 text-sm text-[#003E51]">
            <p className="font-semibold">Rule</p>
            <p className="mt-1 text-[#557072]">{primaryRule}</p>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {lot.allowedFloors.length > 0 ? (
            <span className="rounded-full bg-[#fff7e8] px-3 py-1 text-xs font-semibold text-[#9a6700]">
              {lot.allowedFloors.join(", ")}
            </span>
          ) : null}
          {lot.leaveBy ? (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${lot.violationRisk ? "bg-rose-100 text-rose-700" : "bg-[#edf7f2] text-[#007a4d]"}`}>
              Leave by {lot.leaveBy}
            </span>
          ) : null}
          {lot.violationRisk ? (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
              Violation risk
            </span>
          ) : null}
        </div>
        <div className="h-3 rounded-full bg-slate-100">
          <div
            className={`h-3 rounded-full ${tone === "green" ? "bg-emerald-500" : tone === "yellow" ? "bg-amber-500" : tone === "red" ? "bg-rose-500" : "bg-slate-400"}`}
            style={{ width: formatPercent(lot.occupancyRate) }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div>
            <p className="text-slate-400">Available</p>
            <p className="text-lg font-semibold text-slate-900">{Math.max(freeSlots, 0)}</p>
          </div>
          <div>
            <p className="text-slate-400">Total slots</p>
            <p className="text-lg font-semibold text-slate-900">{lot.totalSlots}</p>
          </div>
        </div>
        <Link
          href={lot.isAllowed ? `/parking/${lot.id}` : "#"}
          className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
            lot.isAllowed ? "bg-[#007a4d] hover:bg-[#006842]" : "cursor-not-allowed bg-slate-400"
          }`}
          aria-disabled={!lot.isAllowed}
        >
          Open lot details
        </Link>
      </div>
    </Card>
  );
}
