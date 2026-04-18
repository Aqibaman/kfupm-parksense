"use client";

import { useEffect, useMemo, useState } from "react";
import { BusNetworkMap } from "@/components/cards/bus-network-map";
import { LiveBusStatusCard } from "@/components/cards/live-bus-status-card";
import { RouteTimeline } from "@/components/cards/route-timeline";
import { CategoryBadge } from "@/components/cards/category-badge";
import { AppShell } from "@/components/layout/app-shell";
import { InfoPanel, SectionGrid } from "@/components/layout/sections";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import { buses, busRoutes, busStops } from "@/lib/data/kfupm-data";
import { buildLiveRouteStates } from "@/lib/services/live-bus-routing";

export default function BusesPage() {
  const { user } = useStudentProfile();
  const [now, setNow] = useState(() => Date.now());
  const networkType = user.gender === "male" ? "male" : "female";
  const filteredRoutes = busRoutes.filter((route) => route.networkType === networkType);
  const filteredBuses = buses.filter((bus) => bus.networkType === networkType);
  const relevantStops = busStops.filter((stop) => filteredRoutes.some((route) => route.stopIds.includes(stop.id)));
  const routeStates = useMemo(() => buildLiveRouteStates(filteredRoutes, relevantStops, filteredBuses, now), [filteredRoutes, filteredBuses, relevantStops, now]);
  const liveBuses = routeStates.flatMap((routeState) =>
    routeState.buses.map((bus) => ({
      bus,
      route: routeState.route,
      currentStop: routeState.stops.find((stop) => stop.id === bus.currentStopId) ?? routeState.stops[0],
      nextStop: routeState.stops.find((stop) => stop.id === bus.nextStopId) ?? routeState.stops[0]
    }))
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <AppShell
      title="Bus Tracking and Route Assistance"
      eyebrow="Transit Layer"
      description="Students only see the bus network relevant to their category. Male students get the male route map, female students get the female route map, with Building 64 transfer guidance kept visible."
    >
      <div className="flex flex-wrap items-center gap-3">
        <CategoryBadge category={user.userCategory} />
        <span className="rounded-full border border-[#dbe9e1] bg-[#f8fbf9] px-4 py-2 text-sm font-medium text-slate-700">
          Showing the {networkType} network only
        </span>
      </div>

      <BusNetworkMap networkLabel={networkType === "male" ? "Male" : "Female"} routeStates={routeStates} />

      <SectionGrid cols="xl:grid-cols-[1fr_1fr]">
        {liveBuses.map(({ bus, route, currentStop, nextStop }) => (
          <LiveBusStatusCard key={bus.id} bus={bus} route={route} currentStop={currentStop} nextStop={nextStop} />
        ))}
      </SectionGrid>

      <div className="grid gap-4 xl:grid-cols-2">
        {routeStates.map((routeState) => (
          <RouteTimeline key={routeState.route.id} routeState={routeState} />
        ))}
      </div>

      <InfoPanel
        title="Where do I go after parking?"
        subtitle="Quick transfer guidance from lots into the shuttle network."
        items={[
          { label: "Lot 64 nearest stop", value: networkType === "male" ? "Station 316 for M3 or M4" : "Station 316 then F8 connector" },
          { label: "Housing-side transfer", value: networkType === "male" ? "Stations 301 to 306" : "Parking 900 and Station 404" },
          { label: "If walking is faster", value: "The recommendation engine can suggest walking instead of a shuttle transfer" }
        ]}
      />
    </AppShell>
  );
}
