"use client";

import { useParams } from "next/navigation";
import { BusETAWidget } from "@/components/cards/bus-eta-widget";
import { SensorStatusPanel } from "@/components/cards/sensor-status-panel";
import { AppShell } from "@/components/layout/app-shell";
import { SectionGrid } from "@/components/layout/sections";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";
import { buses, busRoutes, busStops, parkingLots, parkingSlots, sensors } from "@/lib/data/kfupm-data";
import { getLotPermission } from "@/lib/engines/rules";

export default function ParkingLotDetailPage() {
  const params = useParams<{ lotId: string }>();
  const lot = parkingLots.find((item) => item.id === params.lotId) ?? parkingLots[0];
  const { user } = useStudentProfile();

  const permission = getLotPermission(user, lot);
  const lotSlots = parkingSlots.filter((slot) => slot.lotId === lot.id);
  const lotSensors = sensors.filter((sensor) => sensor.lotId === lot.id);
  const nearestStop = busStops.find((stop) => stop.id === lot.nearestStopIds[0]);
  const activeBus = buses.find((bus) => bus.currentStopId === nearestStop?.id && bus.networkType === user.gender) ?? buses.find((bus) => bus.networkType === user.gender) ?? buses[0];
  const busRoute = busRoutes.find((route) => route.id === activeBus.routeId) ?? busRoutes[0];

  return (
    <AppShell
      title={`${lot.lotCode} · ${lot.lotName}`}
      eyebrow="Parking Lot Detail"
      description="Slot-level visibility, special rules, nearest stop guidance, and sensor health are grouped into one lot operations view."
    >
      <Card>
        <CardTitle
          title="Lot access and rule summary"
          subtitle="The key user permission, nearest stop, and current lot rules are grouped into one quick view."
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Allowed for current user</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{permission.allowed ? "Yes" : "No"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Nearest bus stop</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{nearestStop?.stopName ?? "Pending mapping"}</p>
          </div>
          {permission.reasons.slice(0, 2).map((reason, index) => (
            <div key={reason} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Rule summary {index + 1}</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{reason}</p>
            </div>
          ))}
        </div>
      </Card>
      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardTitle title="Slot grid view" subtitle="Compact slot-level status for the selected lot." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {lotSlots.map((slot) => (
              <div key={slot.id} className={`rounded-2xl border p-3 text-sm ${slot.status === "vacant" ? "border-emerald-200 bg-emerald-50" : slot.status === "occupied" ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
                <p className="font-semibold text-slate-900">{slot.slotCode}</p>
                <p className="text-slate-500">{slot.status}</p>
                <p className="text-slate-400">{slot.floorLevel}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          {nearestStop ? <BusETAWidget bus={activeBus} route={busRoute} stop={nearestStop} /> : null}
          <SensorStatusPanel sensors={lotSensors.slice(0, 4)} />
        </div>
      </SectionGrid>
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
