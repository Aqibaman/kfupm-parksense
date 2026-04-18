import { Card, CardTitle } from "@/components/ui/card";
import type { LiveRouteState } from "@/lib/services/live-bus-routing";

export function RouteTimeline({ routeState }: { routeState: LiveRouteState }) {
  return (
    <Card>
      <CardTitle
        title={`${routeState.route.routeCode} route timeline`}
        subtitle={`${routeState.route.startTime} to ${routeState.route.endTime} - circular service with live buses`}
      />
      <div className="space-y-4">
        {routeState.stops.map((stop, index) => {
          const activeAtStop = routeState.buses.filter((bus) => bus.currentStopId === stop.id || bus.nextStopId === stop.id);

          return (
            <div key={stop.id} className="flex gap-3">
              <div className="flex w-7 flex-col items-center">
                <span className="mt-1 h-3 w-3 rounded-full bg-[#007a4d]" />
                {index < routeState.stops.length - 1 ? <span className="mt-1 h-full w-px bg-[#d6e6dc]" /> : <span className="mt-1 text-sm text-[#007a4d]">↺</span>}
              </div>
              <div className="pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">{stop.stopName}</p>
                  {activeAtStop.map((bus) => (
                    <span
                      key={bus.id}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        bus.stage === "boarding"
                          ? "bg-[#fff5db] text-[#8a6a14]"
                          : bus.stage === "approaching-stop"
                            ? "bg-[#e9f8ef] text-[#007a4d]"
                            : "bg-[#eaf5f7] text-[#0d5f74]"
                      }`}
                    >
                      {bus.busCode}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-500">{stop.servedBuildings.join(", ")}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
