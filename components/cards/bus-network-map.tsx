import { BusFront } from "lucide-react";
import { Card, CardTitle, StatPill } from "@/components/ui/card";
import type { LiveRouteState } from "@/lib/services/live-bus-routing";

export function BusNetworkMap({
  networkLabel,
  routeStates
}: {
  networkLabel: string;
  routeStates: LiveRouteState[];
}) {
  const activeBusCount = routeStates.reduce((sum, routeState) => sum + routeState.activeBusCount, 0);

  return (
    <Card className="min-w-0 overflow-hidden" style={{ background: "linear-gradient(180deg,#ffffff 0%, #f7fbf8 100%)" }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <CardTitle
          title={`${networkLabel} route map`}
          subtitle="Each route now shows live buses moving through the loop, pausing briefly for boarding, then continuing the circular service."
        />
        <StatPill label="Active buses" value={String(activeBusCount)} tone="green" />
      </div>
      <div className="space-y-4">
        {routeStates.map((routeState) => (
          <div key={routeState.route.id} className="min-w-0 overflow-hidden rounded-[26px] border border-[#dbe9e1] bg-white p-4 shadow-[0_12px_36px_rgba(0,62,81,0.05)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#007a4d]">{routeState.route.routeCode}</p>
                <h4 className="mt-2 text-lg font-semibold text-[#0f172a] sm:text-xl">{routeState.route.routeName}</h4>
                <p className="mt-1 text-sm text-slate-500">
                  {routeState.route.startTime} to {routeState.route.endTime} - {routeState.route.frequencyText}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#edf7f2] px-3 py-1 text-xs font-semibold text-[#007a4d]">
                  Buses on route: {routeState.activeBusCount}
                </span>
                <span className="rounded-full border border-[#dbe9e1] bg-white px-3 py-1 text-xs font-semibold text-[#0d5f74]">
                  {routeState.nextArrivalText}
                </span>
              </div>
            </div>

            <div className="mt-5 -mx-1 overflow-x-auto px-1 pb-2">
              <div className="grid grid-cols-3 gap-3 rounded-[24px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fcf9_100%)] px-3 py-4 sm:hidden">
                {routeState.stops.map((stop, index) => {
                  const busesAtStop = routeState.buses.filter((bus) => bus.stage === "boarding" && bus.currentStopId === stop.id);
                  const busesApproaching = routeState.buses.filter((bus) => bus.stage !== "boarding" && bus.nextStopId === stop.id);

                  return (
                    <div key={stop.id} className="rounded-2xl border border-[#dbe9e1] bg-white/80 px-2 py-3 text-center">
                      <div className="mb-2 flex min-h-[28px] flex-wrap items-center justify-center gap-1">
                        {busesAtStop.map((bus) => (
                          <span key={bus.id} className="inline-flex items-center justify-center rounded-full bg-[#007a4d] px-2 py-1 text-white">
                            <BusFront className="h-3 w-3" />
                          </span>
                        ))}
                        {busesApproaching.map((bus) => (
                          <span key={bus.id} className="inline-flex items-center justify-center rounded-full bg-[#0d5f74] px-2 py-1 text-white">
                            <BusFront className="h-3 w-3" />
                          </span>
                        ))}
                      </div>
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#8cc8a2] bg-[#eff8f3] text-xs font-semibold text-[#003E51]">
                        {stop.stopCode}
                      </div>
                      <p className="mt-2 text-[10px] font-medium leading-4 text-slate-600">{stop.stopName}</p>
                      {index === routeState.stops.length - 1 ? (
                        <span className="mt-2 inline-flex whitespace-nowrap rounded-full border border-[#dbe9e1] bg-[#f8fbf9] px-2 py-1 text-[9px] font-semibold text-[#007a4d]">
                          ↺ Restart
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="hidden w-max min-w-full items-center gap-2 rounded-[24px] border border-[#dbe9e1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fcf9_100%)] px-3 py-4 sm:flex sm:gap-3 sm:px-4 sm:py-5">
                {routeState.stops.map((stop, index) => {
                  const busesAtStop = routeState.buses.filter((bus) => bus.stage === "boarding" && bus.currentStopId === stop.id);
                  const busesApproaching = routeState.buses.filter((bus) => bus.stage !== "boarding" && bus.nextStopId === stop.id);

                  return (
                    <div key={stop.id} className="flex shrink-0 items-center gap-2 sm:gap-3">
                      <div className="relative flex flex-col items-center">
                        <div className="mb-2 flex min-h-[28px] flex-wrap items-center justify-center gap-1">
                          {busesAtStop.map((bus) => (
                            <span key={bus.id} className="inline-flex items-center justify-center rounded-full bg-[#007a4d] px-2.5 py-1.5 text-white">
                              <BusFront className="h-3.5 w-3.5" />
                            </span>
                          ))}
                          {busesApproaching.map((bus) => (
                            <span key={bus.id} className="inline-flex items-center justify-center rounded-full bg-[#0d5f74] px-2.5 py-1.5 text-white">
                              <BusFront className="h-3.5 w-3.5" />
                            </span>
                          ))}
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#8cc8a2] bg-[#eff8f3] text-xs font-semibold text-[#003E51] sm:h-12 sm:w-12 sm:text-sm">
                          {stop.stopCode}
                        </div>
                        <p className="mt-2 max-w-[64px] text-center text-[10px] font-medium leading-4 text-slate-600 sm:max-w-none sm:text-xs">
                          {stop.stopName}
                        </p>
                      </div>
                      {index < routeState.stops.length - 1 ? (
                        <div className="flex items-center gap-2">
                          <div className="h-[2px] w-7 rounded-full bg-[#8cc8a2] sm:w-10" />
                          {routeState.buses
                            .filter((bus) => bus.stage !== "boarding" && bus.currentStopId === stop.id)
                            .map((bus) => (
                              <span key={bus.id} className="inline-flex items-center justify-center rounded-full border border-[#0d5f74]/20 bg-[#eaf5f7] px-2.5 py-1.5 text-[#0d5f74]">
                                <BusFront className="h-3.5 w-3.5" />
                              </span>
                            ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-[2px] w-7 rounded-full bg-[#8cc8a2] sm:w-10" />
                          <span className="whitespace-nowrap rounded-full border border-[#dbe9e1] bg-[#f8fbf9] px-3 py-1 text-[10px] font-semibold text-[#007a4d] sm:text-[11px]">
                            ↺ U-turn and restart
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {routeState.buses.map((bus) => (
                <div key={bus.id} className="rounded-2xl border border-[#dbe9e1] bg-[#f8fbf9] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#003E51]">{bus.busCode}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        bus.stage === "boarding"
                          ? "bg-[#fff5db] text-[#8a6a14]"
                          : bus.stage === "approaching-stop"
                            ? "bg-[#e9f8ef] text-[#007a4d]"
                            : "bg-[#eaf5f7] text-[#0d5f74]"
                      }`}
                    >
                      {bus.stage === "boarding" ? "Boarding" : bus.stage === "approaching-stop" ? "Approaching stop" : "Running"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{bus.statusText}</p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">Buildings served: {routeState.route.servedBuildings.join(", ")}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
