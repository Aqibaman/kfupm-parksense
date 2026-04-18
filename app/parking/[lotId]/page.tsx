"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ActiveParkingSessionCard } from "@/components/cards/active-parking-session-card";
import { BusETAWidget } from "@/components/cards/bus-eta-widget";
import { CountdownList } from "@/components/cards/countdown-list";
import { FloorSummaryCards } from "@/components/cards/floor-summary-cards";
import { FloorTabs } from "@/components/cards/floor-tabs";
import { ParkingPageSessionBanner } from "@/components/cards/parking-page-session-banner";
import { ParkingStartedModal } from "@/components/cards/parking-started-modal";
import { RuleAlertsPanel } from "@/components/cards/rule-alerts-panel";
import { SlotActionBar } from "@/components/cards/slot-action-bar";
import { SlotGrid } from "@/components/cards/slot-grid";
import { SmartGuidanceCard } from "@/components/cards/smart-guidance-card";
import { AppShell } from "@/components/layout/app-shell";
import { useParkingSession } from "@/components/providers/parking-session-provider";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";
import { buses, busRoutes, busStops, parkingLots } from "@/lib/data/kfupm-data";
import { buildFloorSlotGrid, getLotAccessDetails, getLotStructure, getSeedLotForDetail } from "@/lib/engines/lot-detail";
import { toStudentCategory } from "@/lib/engines/rules";

export default function ParkingLotDetailPage() {
  const params = useParams<{ lotId: string }>();
  const { user } = useStudentProfile();
  const { activeSession, modalData, modalOpen, dismissModal, startSession, stopSession, parkingPageData, now, locationState } = useParkingSession();
  const category = toStudentCategory(user.userCategory);
  const seedLot = getSeedLotForDetail(params.lotId) ?? parkingLots[0];
  const lotStructure = useMemo(() => getLotStructure(params.lotId), [params.lotId]);
  const lotAccess = useMemo(() => getLotAccessDetails(category, params.lotId, now), [category, now, params.lotId]);
  const floorResults = useMemo(() => buildFloorSlotGrid(category, params.lotId, now), [category, now, params.lotId]);
  const [activeFloorKey, setActiveFloorKey] = useState(floorResults[0]?.floor.key ?? "F1");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  useEffect(() => {
    if (!floorResults.find((floor) => floor.floor.key === activeFloorKey)) {
      setActiveFloorKey(floorResults[0]?.floor.key ?? "F1");
    }
  }, [activeFloorKey, floorResults]);

  const activeFloor = floorResults.find((floor) => floor.floor.key === activeFloorKey) ?? floorResults[0];
  const selectedSlot = activeFloor?.slots.find((slot) => slot.id === selectedSlotId) ?? null;
  const currentLotSession = activeSession?.lotId === seedLot.id ? activeSession : null;
  const currentLotPageData = currentLotSession ? parkingPageData : null;
  const nearestStop = busStops.find((stop) => stop.id === seedLot.nearestStopIds[0]);
  const activeBus =
    buses.find((bus) => bus.currentStopId === nearestStop?.id && bus.networkType === user.gender) ??
    buses.find((bus) => bus.networkType === user.gender) ??
    buses[0];
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

  async function handleParked() {
    if (!selectedSlot || !activeFloor) return;
        await startSession({
      lotId: seedLot.id,
      floorKey: activeFloor.floor.key,
      slotId: selectedSlot.label,
      fallbackCoordinates: { lat: seedLot.latitude, lng: seedLot.longitude }
    });
  }

  function handleLeft() {
    stopSession();
    setSelectedSlotId(null);
  }

  return (
    <>
      <AppShell
        title={`${seedLot.lotCode} · ${lotStructure.name}`}
        eyebrow="Parking Lot Detail"
        description="Review floor-specific parking rules, choose a slot, and start a monitored parked session with alerts, countdowns, and smart guidance."
      >
        {currentLotPageData ? <ParkingPageSessionBanner data={currentLotPageData} /> : null}

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <CardTitle title={lotStructure.name} subtitle={`${structureLabel} · permit-aware capacity and floor logic for this lot`} />
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
          <CardTitle title="Floor access and slot grid" subtitle="Select a floor, inspect slots, and start or end your parked session from the chosen space." />
          <FloorTabs floors={floorResults} activeFloor={activeFloorKey} onSelect={setActiveFloorKey} />
          <div className="mt-5">
            <FloorSummaryCards floors={floorResults} />
          </div>
          {activeFloor ? (
            <div className="mt-5 space-y-5">
              <SlotGrid floor={activeFloor} selectedSlotId={selectedSlotId} onSlotSelect={setSelectedSlotId} />
              {selectedSlot ? (
                <SlotActionBar
                  lotName={lotStructure.name}
                  floorLabel={activeFloor.floor.label}
                  slotLabel={selectedSlot.label}
                  onParked={handleParked}
                  onLeft={handleLeft}
                  disabled={!selectedSlot.interactive}
                  locationState={locationState}
                />
              ) : null}
            </div>
          ) : null}
        </Card>

        {currentLotPageData ? (
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <ActiveParkingSessionCard data={currentLotPageData} now={now} />
            <CountdownList countdowns={currentLotPageData.countdowns} />
            <RuleAlertsPanel alerts={currentLotPageData.alerts} />
            <SmartGuidanceCard guidance={currentLotPageData.guidance} showLinks />
          </div>
        ) : null}

        {nearestStop ? <BusETAWidget bus={activeBus} route={busRoute} stop={nearestStop} /> : null}

        <ChartBars
          title="Historical occupancy trend"
          subtitle="Use the busiest times below to know when this lot usually peaks."
          items={[
            { label: "7 AM", value: 32 },
            { label: "10 AM", value: 89 },
            { label: "1 PM", value: 94 },
            { label: "4 PM", value: 78 },
            { label: "7 PM", value: 51 }
          ]}
        />
      </AppShell>

      <ParkingStartedModal open={modalOpen} data={modalData} onClose={dismissModal} />
    </>
  );
}
