"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RouteTimeline } from "@/components/cards/route-timeline";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { buses, busRoutes, busStops } from "@/lib/data/kfupm-data";
import { buildLiveRouteStates } from "@/lib/services/live-bus-routing";

export default function BusRoutesPage() {
  const { user } = useStudentProfile();
  const [now, setNow] = useState(() => Date.now());
  const filteredRoutes = busRoutes.filter((route) => route.networkType === user.gender);
  const filteredBuses = buses.filter((bus) => bus.networkType === user.gender);
  const relevantStops = busStops.filter((stop) => filteredRoutes.some((route) => route.stopIds.includes(stop.id)));
  const routeStates = useMemo(() => buildLiveRouteStates(filteredRoutes, relevantStops, filteredBuses, now), [filteredRoutes, relevantStops, filteredBuses, now]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <AppShell
      title="Bus Routes"
      eyebrow="Route Library"
      description="Route summaries are filtered by the student profile, so users only see the network relevant to their gender-based bus system."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {routeStates.map((routeState) => (
          <RouteTimeline key={routeState.route.id} routeState={routeState} />
        ))}
      </div>
    </AppShell>
  );
}
