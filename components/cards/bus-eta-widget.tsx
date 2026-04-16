import { Card, CardTitle, StatPill } from "@/components/ui/card";
import type { Bus, BusRoute, BusStop } from "@/lib/types";

export function BusETAWidget({ bus, route, stop }: { bus: Bus; route: BusRoute; stop: BusStop }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <CardTitle title={`${bus.busCode} · ${route.routeCode}`} subtitle={route.routeName} />
        <StatPill label="ETA" value={bus.etaMeta} tone={bus.status === "online" ? "green" : "yellow"} />
      </div>
      <div className="space-y-2 text-sm text-slate-600">
        <p><span className="font-semibold text-slate-900">Current stop:</span> {stop.stopName}</p>
        <p><span className="font-semibold text-slate-900">Operating window:</span> {route.startTime} to {route.endTime}</p>
        <p><span className="font-semibold text-slate-900">Frequency:</span> {route.frequencyText}</p>
      </div>
    </Card>
  );
}
