"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { busRoutes, busStops } from "@/lib/data/kfupm-data";

export default function BusStopsPage() {
  const { user } = useStudentProfile();
  const allowedStopIds = new Set(busRoutes.filter((route) => route.networkType === user.gender).flatMap((route) => route.stopIds));
  const filteredStops = busStops.filter((stop) => allowedStopIds.has(stop.id));

  return (
    <AppShell
      title="Bus Stops"
      eyebrow="Stop Directory"
      description="Stop records are narrowed to the student’s bus network so the experience stays focused and permit-aware."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredStops.map((stop) => (
          <Card key={stop.id}>
            <CardTitle title={`${stop.stopCode} · ${stop.stopName}`} subtitle={stop.arabicName} />
            <p className="text-sm text-slate-500">Nearby lots: {stop.nearbyLots.join(", ")}</p>
            <p className="mt-2 text-sm text-slate-500">Served buildings: {stop.servedBuildings.join(", ")}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
