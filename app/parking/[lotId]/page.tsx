"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BusETAWidget } from "@/components/cards/bus-eta-widget";
import { FloorSummaryCards } from "@/components/cards/floor-summary-cards";
import { FloorTabs } from "@/components/cards/floor-tabs";
import { SlotGrid } from "@/components/cards/slot-grid";
import { AppShell } from "@/components/layout/app-shell";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";
import { buses, busRoutes, busStops, parkingLots } from "@/lib/data/kfupm-data";
import { getLotAccessDetails, getLotStructure, buildFloorSlotGrid, getSeedLotForDetail } from "@/lib/engines/lot-detail";
import { toStudentCategory } from "@/lib/engines/rules";

export default function ParkingLotDetailPage() {
  const params = useParams<{ lotId: string }>();
  const { user } = useStudentProfile();
  const category = toStudentCategory(user.userCategory);
  const seedLot = getSeedLotForDetail(params.lotId) ?? parkingLots[0];
  const lotStructure = useMemo(() => getLotStructure(params.lotId), [params.lotId]);
  const lotAccess = useMemo(() => getLotAccessDetails(category, params.lotId, new Date()), [category, params.lotId]);
  const floorResults = useMemo(() => buildFloorSlotGrid(category, params.lotId, new Date()), [category, params.lotId]);
  const [activeFloorKey, setActiveFloorKey] = useState(floorResults[0]?.floor.key ?? "F1");
  const activeFloor = floorResults.find((floor) => floor.floor.key === activeFloorKey) ?? floorResults[0];
  const nearestStop = busStops.find((stop) => stop.id === seedLot.nearestStopIds[0]);
  const activeBus = buses.find((bus) => bus.currentStopId === nearestStop?.id && bus.networkType === user.gender) ?? buses.find((bus) => bus.networkType === user.gender) ?? buses[0];
  const busRoute = busRoutes.find((route) => route.id === activeBus.routeId) ?? busRoutes[0];
  const storyBadge =
    lotStructure.storyCountSource === "official"
      ? `Official: ${lotStructure.storyCount} ${lotStructure.storyCount === 1 ? "level" : "levels"}`
      : `Assumed: ${lotStructure.storyCount} ${lotStructure.storyCount === 1 ? "level" : "levels"}`;
  const structureLabel =
    lotStructure.id === "parking_64"
      ? "4 structured levels + uncovered zone"
      : lotStructure.storyCount === 1 && lotStructure.floors[0]?.kind === "uncovered"
        ? "1 open parking level"
        : `${lotStructure.storyCount} ${lotStructure.storyCount === 1 ? "story" : "stories"}`;

  return (
    <AppShell
      title={`${seedLot.lotCode} · ${lotStructure.name}`}
      eyebrow="Parking Lot Detail"
      description="Story count, floor access rules, and floor-by-floor slot visibility are grouped into one lot operations view."
    >
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <CardTitle
            title={`${lotStructure.name}`}
            subtitle={`${structureLabel} · capacity distributed floor by floor with permit-aware access`}
          />
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#edf7f2] px-4 py-2 text-sm font-semibold text-[#007a4d]">{storyBadge}</span>
            <span className="rounded-full border border-[#dbe9e1] bg-white px-4 py-2 text-sm font-semibold text-[#003E51]">
              Total capacity {lotStructure.totalCapacity}
            </span>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Allowed for current user</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{lotAccess.allowed ? "Yes" : "No"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Nearest bus stop</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{nearestStop?.stopName ?? "Pending mapping"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Primary rule</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{lotAccess.primaryRule}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Allowed floors/areas</p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {lotAccess.allowedAreasOrFloors.length ? lotAccess.allowedAreasOrFloors.join(", ") : "General lot access"}
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-[#dbe9e1] bg-[#f8fbf9] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#008540]">Full lot rules</p>
            {lotAccess.leaveBy ? (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${lotAccess.violationRisk ? "bg-rose-100 text-rose-700" : "bg-[#edf7f2] text-[#007a4d]"}`}>
                {lotAccess.violationRisk ? "Leave now to avoid violation" : `Leave by ${lotAccess.leaveBy}`}
              </span>
            ) : null}
          </div>
          <div className="mt-3 space-y-2">
            {lotAccess.fullRuleText.map((rule) => (
              <p key={rule} className="rounded-2xl border border-[#dbe9e1] bg-white px-3 py-2 text-sm text-[#003E51]">
                {rule}
              </p>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle title="Floor access and slot grid" subtitle="Switch floors below to see capacity, access rules, and slot availability for each level." />
        <FloorTabs floors={floorResults} activeFloor={activeFloorKey} onSelect={setActiveFloorKey} />
        <div className="mt-5">
          <FloorSummaryCards floors={floorResults} />
        </div>
        {activeFloor ? <div className="mt-5"><SlotGrid floor={activeFloor} /></div> : null}
      </Card>

      {nearestStop ? <BusETAWidget bus={activeBus} route={busRoute} stop={nearestStop} /> : null}

      <ChartBars
        title="Historical occupancy trend"
        subtitle="Peak periods help students understand when this lot becomes busiest."
        items={[
          { label: "7 AM", value: 32 },
          { label: "10 AM", value: 89 },
          { label: "1 PM", value: 94 },
          { label: "4 PM", value: 78 },
          { label: "7 PM", value: 51 }
        ]}
      />
    </AppShell>
  );
}
