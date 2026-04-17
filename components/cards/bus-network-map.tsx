import { Card, CardTitle, StatPill } from "@/components/ui/card";
import type { Bus, BusRoute, BusStop } from "@/lib/types";

export function BusNetworkMap({
  networkLabel,
  routes,
  stops,
  activeBuses
}: {
  networkLabel: string;
  routes: BusRoute[];
  stops: BusStop[];
  activeBuses: Bus[];
}) {
  return (
    <Card style={{ background: "linear-gradient(180deg,#ffffff 0%, #f7fbf8 100%)" }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <CardTitle
          title={`${networkLabel} route map`}
          subtitle="A route-board view inspired by the student-hub bus module, showing only the network relevant to the current student."
        />
        <StatPill label="Active buses" value={String(activeBuses.length)} tone="green" />
      </div>
      <div className="space-y-4">
        {routes.map((route) => {
          const routeStops = stops.filter((stop) => route.stopIds.includes(stop.id));
          const bus = activeBuses.find((item) => item.routeId === route.id);

          return (
            <div key={route.id} className="rounded-[26px] border border-[#dbe9e1] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#007a4d]">{route.routeCode}</p>
                  <h4 className="mt-2 text-xl font-semibold text-[#0f172a]">{route.routeName}</h4>
                  <p className="mt-1 text-sm text-slate-500">
                    {route.startTime} to {route.endTime} - {route.frequencyText}
                  </p>
                </div>
                <span className="rounded-full bg-[#edf7f2] px-3 py-1 text-xs font-semibold text-[#007a4d]">
                  {bus ? bus.etaMeta : "No live bus seeded"}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {routeStops.map((stop, index) => (
                  <div key={stop.id} className="flex items-center gap-3">
                    <div className="rounded-full border border-[#8cc8a2] bg-[#eff8f3] px-4 py-2 text-sm font-medium text-[#003E51]">
                      {stop.stopCode} - {stop.stopName}
                    </div>
                    {index < routeStops.length - 1 ? <div className="h-[2px] w-8 rounded-full bg-[#8cc8a2]" /> : null}
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">Buildings served: {route.servedBuildings.join(", ")}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
