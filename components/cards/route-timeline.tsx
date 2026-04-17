import { Card, CardTitle } from "@/components/ui/card";
import type { BusRoute, BusStop } from "@/lib/types";

export function RouteTimeline({ route, stops }: { route: BusRoute; stops: BusStop[] }) {
  return (
    <Card>
      <CardTitle title={`${route.routeCode} route timeline`} subtitle={`${route.startTime} to ${route.endTime} - ${route.frequencyText}`} />
      <div className="space-y-4">
        {stops.map((stop, index) => (
          <div key={stop.id} className="flex gap-3">
            <div className="flex w-7 flex-col items-center">
              <span className="mt-1 h-3 w-3 rounded-full bg-[#007a4d]" />
              {index < stops.length - 1 ? <span className="mt-1 h-full w-px bg-[#d6e6dc]" /> : null}
            </div>
            <div className="pb-4">
              <p className="font-semibold text-slate-900">{stop.stopName}</p>
              <p className="text-sm text-slate-500">{stop.servedBuildings.join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
