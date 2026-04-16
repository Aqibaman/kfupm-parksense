import Link from "next/link";
import { Card, CardTitle, StatPill } from "@/components/ui/card";
import { formatPercent, lotAvailabilityTone } from "@/lib/utils";
import type { ParkingLot } from "@/lib/types";

export function LotOccupancyCard({ lot, allowed }: { lot: ParkingLot; allowed: boolean }) {
  const tone = !allowed ? "slate" : lotAvailabilityTone(lot.occupancyRate) === "green" ? "green" : lotAvailabilityTone(lot.occupancyRate) === "yellow" ? "yellow" : "red";
  const freeSlots = Math.round(lot.totalSlots * (1 - lot.occupancyRate));

  return (
    <Card className={!allowed ? "opacity-70" : undefined}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">{lot.zone}</p>
          <CardTitle title={`${lot.lotCode} · ${lot.lotName}`} subtitle={lot.buildingCluster} />
        </div>
        <StatPill label={allowed ? "Status" : "Access"} value={allowed ? formatPercent(1 - lot.occupancyRate) : "Restricted"} tone={tone} />
      </div>
      <div className="mt-4 space-y-3">
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
        <Link href={`/parking/${lot.id}`} className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
          Open lot details
        </Link>
      </div>
    </Card>
  );
}
