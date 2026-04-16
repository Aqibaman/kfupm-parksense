import { AppShell } from "@/components/layout/app-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { busStops } from "@/lib/data/kfupm-data";

export default function BusStopsPage() {
  return (
    <AppShell
      title="Bus Stops"
      eyebrow="Stop Directory"
      description="Each stop record carries nearby lots, served buildings, and future-ready map coordinates for campus visualization."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {busStops.map((stop) => (
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
