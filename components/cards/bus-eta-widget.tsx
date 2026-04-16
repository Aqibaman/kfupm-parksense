import { Card, CardTitle, StatPill } from "@/components/ui/card";
import type { Bus, BusRoute, BusStop } from "@/lib/types";

export function BusETAWidget({ bus, route, stop }: { bus: Bus; route: BusRoute; stop: BusStop }) {
  return (
    <Card className="bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)]">
      <div className="flex items-start justify-between gap-4">
        <CardTitle title={`${bus.busCode} - ${route.routeCode}`} subtitle={route.routeName} />
        <StatPill label="ETA" value={bus.etaMeta} tone={bus.status === "online" ? "green" : "yellow"} />
      </div>
      <div className="space-y-2 text-sm text-[#557072]">
        <p>
          <span className="font-semibold text-[#003E51]">Current stop:</span> {stop.stopName}
        </p>
        <p>
          <span className="font-semibold text-[#003E51]">Operating window:</span> {route.startTime} to {route.endTime}
        </p>
        <p>
          <span className="font-semibold text-[#003E51]">Frequency:</span> {route.frequencyText}
        </p>
      </div>
    </Card>
  );
}
