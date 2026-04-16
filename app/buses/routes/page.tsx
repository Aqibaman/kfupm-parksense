import { AppShell } from "@/components/layout/app-shell";
import { RouteTimeline } from "@/components/cards/route-timeline";
import { busRoutes, busStops } from "@/lib/data/kfupm-data";

export default function BusRoutesPage() {
  return (
    <AppShell
      title="Bus Routes"
      eyebrow="Route Library"
      description="Poster-derived route summaries are modeled as reusable records so ETA, stop matching, and destination guidance can all share one source."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {busRoutes.map((route) => (
          <RouteTimeline key={route.id} route={route} stops={busStops.filter((stop) => route.stopIds.includes(stop.id))} />
        ))}
      </div>
    </AppShell>
  );
}
