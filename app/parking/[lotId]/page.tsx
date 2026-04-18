"use client";

import { useParams } from "next/navigation";
import { BusETAWidget } from "@/components/cards/bus-eta-widget";
import { AppShell } from "@/components/layout/app-shell";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";
import { buses, busRoutes, busStops, parkingLots } from "@/lib/data/kfupm-data";
import { getLotAccessDetails, getPermittedLots, toStudentCategory } from "@/lib/engines/rules";

export default function ParkingLotDetailPage() {
  const params = useParams<{ lotId: string }>();
  const lot = parkingLots.find((item) => item.id === params.lotId) ?? parkingLots[0];
  const { user } = useStudentProfile();

  const category = toStudentCategory(user.userCategory);
  const [lotView] = getPermittedLots(category, [lot], new Date(), { showUnauthorizedAsDisabled: true });
  const accessDetails = lotView ? getLotAccessDetails(category, lotView.canonicalLotId, new Date()) : null;
  const nearestStop = busStops.find((stop) => stop.id === lot.nearestStopIds[0]);
  const activeBus = buses.find((bus) => bus.currentStopId === nearestStop?.id && bus.networkType === user.gender) ?? buses.find((bus) => bus.networkType === user.gender) ?? buses[0];
  const busRoute = busRoutes.find((route) => route.id === activeBus.routeId) ?? busRoutes[0];
  const unavailableSlots = new Set([7, 18, 34, 63, 91]);
  const occupiedSlots = new Set(
    Array.from({ length: 100 }, (_, index) => index + 1).filter(
      (slotNumber) => !unavailableSlots.has(slotNumber) && (slotNumber % 3 === 0 || slotNumber % 7 === 0 || slotNumber % 11 === 0)
    )
  );
  const slotBoard = Array.from({ length: 100 }, (_, index) => {
    const slotNumber = index + 1;

    if (unavailableSlots.has(slotNumber)) {
      return { number: slotNumber, status: "unavailable" as const };
    }

    if (occupiedSlots.has(slotNumber)) {
      return { number: slotNumber, status: "occupied" as const };
    }

    return { number: slotNumber, status: "vacant" as const };
  });
  const occupiedCount = slotBoard.filter((slot) => slot.status === "occupied").length;
  const vacantCount = slotBoard.filter((slot) => slot.status === "vacant").length;

  return (
    <AppShell
      title={`${lot.lotCode} · ${lot.lotName}`}
      eyebrow="Parking Lot Detail"
      description="Slot visibility, permit-specific parking rules, and nearest stop guidance are grouped into one lot operations view."
    >
      <Card>
        <CardTitle
          title="Lot access and rule summary"
          subtitle="Read the primary lot rule first so you can park without violating the permit conditions."
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Allowed for current user</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{accessDetails?.allowed ? "Yes" : "No"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Nearest bus stop</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{nearestStop?.stopName ?? "Pending mapping"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Primary rule</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{lotView?.ruleText[0] ?? accessDetails?.specialNote ?? "No special rule recorded."}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Access detail</p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {lotView?.allowedFloors.length ? `Allowed: ${lotView.allowedFloors.join(", ")}` : accessDetails?.timeRestrictionText ?? "General permit access"}
            </p>
          </div>
        </div>
        {lotView?.ruleText?.length ? (
          <div className="mt-4 rounded-2xl border border-[#dbe9e1] bg-[#f8fbf9] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#008540]">Full lot rule</p>
            <div className="mt-3 space-y-2 text-sm text-[#003E51]">
              {lotView.ruleText.map((rule) => (
                <p key={rule} className="rounded-2xl border border-[#dbe9e1] bg-white px-3 py-2">
                  {rule}
                </p>
              ))}
            </div>
          </div>
        ) : null}
      </Card>
      <Card>
        <CardTitle title="Slot grid view" subtitle="See which spaces are open, occupied, or unavailable below." />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_240px]">
          <div className="rounded-[28px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f6fbf8_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#dbe9e1] bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#008540]">Live slot board</p>
              <p className="text-lg font-semibold text-[#003E51]">{vacantCount} vacant</p>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
              {slotBoard.map((slot) => (
                <div
                  key={slot.number}
                  className={
                    slot.status === "vacant"
                      ? "flex aspect-square items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-800 shadow-sm"
                      : slot.status === "occupied"
                        ? "flex aspect-square items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-800 shadow-sm"
                        : "flex aspect-square items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-500 shadow-sm"
                  }
                >
                  {slot.number}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-[#dbe9e1] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#003E51]">Legend</p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-lg border border-emerald-300 bg-emerald-200" />
                  <p className="text-sm font-semibold text-emerald-900">Vacant</p>
                </div>
                <p className="text-sm font-semibold text-emerald-800">{vacantCount}</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-lg border border-rose-300 bg-rose-200" />
                  <p className="text-sm font-semibold text-rose-900">Occupied</p>
                </div>
                <p className="text-sm font-semibold text-rose-800">{occupiedCount}</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-lg border border-slate-300 bg-slate-200" />
                  <p className="text-sm font-semibold text-slate-900">Unavailable</p>
                </div>
                <p className="text-sm font-semibold text-slate-600">5</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {nearestStop ? <BusETAWidget bus={activeBus} route={busRoute} stop={nearestStop} /> : null}
      <ChartBars
        title="Historical occupancy trend"
        subtitle="Mocked demand profile that mirrors high pressure around special rule zones."
        items={[
          { label: "7 AM", value: 32 },
          { label: "10 AM", value: 89 },
          { label: "1 PM", value: 94 },
          { label: "4 PM", value: 78 },
          { label: "7 PM", value: 51 }
        ]}
        tone="bg-sky-500"
      />
    </AppShell>
  );
}
