import { notFound } from "next/navigation";
import { BusETAWidget } from "@/components/cards/bus-eta-widget";
import { SensorStatusPanel } from "@/components/cards/sensor-status-panel";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { Card, CardTitle } from "@/components/ui/card";
import { ChartBars } from "@/components/ui/chart-bars";
import { buses, busRoutes, busStops, parkingLots, parkingSlots, sensors } from "@/lib/data/kfupm-data";
import { getDemoUser } from "@/lib/services/query";
import { getLotPermission } from "@/lib/engines/rules";

export default function ParkingLotDetailPage({ params }: { params: { lotId: string } }) {
  const lot = parkingLots.find((item) => item.id === params.lotId);
  if (!lot) return notFound();

  const user = getDemoUser();
  const permission = getLotPermission(user, lot);
  const lotSlots = parkingSlots.filter((slot) => slot.lotId === lot.id);
  const lotSensors = sensors.filter((sensor) => sensor.lotId === lot.id);
  const nearestStop = busStops.find((stop) => stop.id === lot.nearestStopIds[0]);
  const activeBus = buses.find((bus) => bus.currentStopId === nearestStop?.id) ?? buses[0];
  const busRoute = busRoutes.find((route) => route.id === activeBus.routeId) ?? busRoutes[0];

  return (
    <AppShell
      title={`${lot.lotCode} · ${lot.lotName}`}
      eyebrow="Parking Lot Detail"
      description="Slot-level visibility, special rules, nearest stop guidance, and sensor health are grouped into one lot operations view."
    >
      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        <InfoPanel
          title="Lot summary"
          items={[
            { label: "Zone", value: lot.zone },
            { label: "Cluster", value: lot.buildingCluster },
            { label: "Allowed for current user", value: permission.allowed ? "Yes" : "No" },
            { label: "Nearest bus stop", value: nearestStop?.stopName ?? "Pending mapping" }
          ]}
        />
        <Card>
          <CardTitle title="Current rule summary" subtitle="Directly seeded from the parking report and special notices." />
          <div className="space-y-2 text-sm text-slate-600">
            {permission.reasons.map((reason) => (
              <p key={reason} className="rounded-2xl border border-slate-200 p-3">{reason}</p>
            ))}
          </div>
        </Card>
      </SectionGrid>
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
