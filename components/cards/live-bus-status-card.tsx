import { Card, CardTitle, StatPill } from "@/components/ui/card";
import type { LiveBusState } from "@/lib/services/live-bus-routing";
import type { BusRoute, BusStop } from "@/lib/types";

export function LiveBusStatusCard({
  bus,
  route,
  currentStop,
  nextStop
}: {
  bus: LiveBusState;
  route: BusRoute;
  currentStop: BusStop;
  nextStop: BusStop;
}) {
  const tone = bus.stage === "boarding" ? "yellow" : bus.stage === "approaching-stop" ? "green" : "blue";

  return (
    <Card className="bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)]">
      <div className="flex items-start justify-between gap-4">
        <CardTitle title={`${bus.busCode} - ${route.routeCode}`} subtitle={route.routeName} />
        <StatPill label="Live stage" value={bus.stage === "boarding" ? "Boarding" : bus.stage === "approaching-stop" ? "Approaching" : "Running"} tone={tone} />
      </div>
      <div className="space-y-2 text-sm text-[#557072]">
        <p>
          <span className="font-semibold text-[#003E51]">Current stop:</span> {currentStop.stopName}
        </p>
        <p>
          <span className="font-semibold text-[#003E51]">Next stop:</span> {nextStop.stopName}
        </p>
        <p>
          <span className="font-semibold text-[#003E51]">Live status:</span> {bus.statusText}
        </p>
        <p>
          <span className="font-semibold text-[#003E51]">Route loop:</span> {bus.routeLoopText}
        </p>
      </div>
    </Card>
  );
}
