import { BusETAWidget } from "@/components/cards/bus-eta-widget";
import { AppShell } from "@/components/layout/app-shell";
import { buses, busRoutes, busStops } from "@/lib/data/kfupm-data";

export default function AdminBusesPage() {
  return (
    <AppShell
      title="Bus Operations"
      eyebrow="Admin · Transit"
      description="Track route assignment, current stop, ETA, and network type for the male and female bus systems."
      admin
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {buses.map((bus) => (
          <BusETAWidget
            key={bus.id}
            bus={bus}
            route={busRoutes.find((route) => route.id === bus.routeId)!}
            stop={busStops.find((stop) => stop.id === bus.currentStopId)!}
          />
        ))}
      </div>
    </AppShell>
  );
}
